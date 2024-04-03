import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MApproverTime } from 'src/app/Models/MApproverTime';
import { MApproverTimeCreate } from 'src/app/Models/MApproverTimeCreate';
import { ApproverTimeCreateService } from 'src/app/Views/aprovve-time/services/approverTimeCreate/approver-time-create.service';
import Swal from 'sweetalert2';
import { ApiUser } from '../user/services/user/api.user';
import { map } from 'rxjs';
import { MAprobadorUsuario } from 'src/app/Models/MAprobadorUsuario';
import { Guid } from 'guid-typescript';
import { AprovveTimeComponent } from '../aprovve-time/aprovve-time.component';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-pop-up-aprovve',
  templateUrl: './pop-up-aprovve.component.html',
  styleUrls: ['./pop-up-aprovve.component.css']
})
export class PopUpAprovveComponent {
 

  mApprover: MApproverTime;
  mApproverCreate: MApproverTimeCreate;
  MAprobadorUser: MAprobadorUsuario [];
  aprobador = new FormControl('');
  idUser: any;
  MUser: MUserEntity;
  btnOKState: boolean=false;
  btnOKStateLoading: boolean=false;
  //confirmedControl = new FormControl(false);
  checked: boolean = false;
  filterStatusPrivatUser: boolean = true;

  userForm = new FormGroup({
    aprobacion: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  });

 

  @ViewChild(AprovveTimeComponent, { static: true })
  aprovveTimeComponent!: AprovveTimeComponent;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PopUpAprovveComponent>,
  private serviceApproverTimeCreate: ApproverTimeCreateService,
  private apiUser: ApiUser,
  private obtnerLista: ObtenerlistaService,
  private storageService: StorageService,
  ) {
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.mApprover = {} as MApproverTime;
    this.mApproverCreate = {} as MApproverTimeCreate;
    this.Aproved();
    this.MAprobadorUser =[];
    this.btnOKState = true;
    this.btnOKStateLoading=false;
  }

  crearAprobacion(){
    this.btnOKState = true;
    this.btnOKStateLoading=true;
    console.log(this.userForm.value.aprobacion);
    this.mApproverCreate.roleAprobador=this.MUser.rolEntity.nameRole; //OK
    this.mApproverCreate.horusReportEntityId = this.mApprover.horusReportEntityId;
    this.mApproverCreate.description = this.userForm.value.descripcion!;
    this.mApproverCreate.idAssignmentReport=this.mApprover.idAssignmentReport;
    

    this.mApproverCreate.state = parseInt(this.userForm.value.aprobacion!);
 

    //APROBADA
    if(this.userForm.value.aprobacion == '0'){
      this.mApproverCreate.userId = this.mApprover.userEntityId;;//this.aprobador.value as unknown as Guid;
       //aprovador 1 -harold
      this.mApproverCreate.aprobador1UserEntityId= this.mApprover.userEntityId;
      //aprovador 2 -camilo
      this.mApproverCreate.aprobador2UserEntityId= this.aprobador.value as unknown as Guid;
      //trabajador -felipe
      this.mApproverCreate.empleadoUserEntityId= this.mApprover.horusReportEntity.userEntity.idUser;

      //validate if it is Aprobador N2
      if(this.MUser.rolEntity.nameRole=='Usuario Aprobador N2'){
        //this.mApproverCreate.userId = '00000000-0000-0000-0000-000000000000' as unknown as Guid;
        this.mApproverCreate.aprobador2UserEntityId=  this.mApprover.userEntityId;;
      }



    }else{
      //RECHAZADA
      this.mApproverCreate.userId = this.mApprover.userEntityId;;//'00000000-0000-0000-0000-000000000000' as unknown as Guid;
      this.mApproverCreate.aprobador2UserEntityId=  '00000000-0000-0000-0000-000000000000' as unknown as Guid;
       //aprovador 1 -harold
      this.mApproverCreate.aprobador1UserEntityId= this.mApprover.userEntityId;
      //trabajador -felipe
      this.mApproverCreate.empleadoUserEntityId= this.mApprover.horusReportEntity.userEntity.idUser;

      //validate if it is Aprobador N2
      if(this.MUser.rolEntity.nameRole=='Usuario Aprobador N2'){
        //this.mApproverCreate.userId = '00000000-0000-0000-0000-000000000000' as unknown as Guid;
        this.mApproverCreate.aprobador2UserEntityId=   this.mApprover.userEntityId as unknown as Guid;
      }
    }
   

    
    console.log(this.mApproverCreate);

    this.serviceApproverTimeCreate.PostCreateApproverTime(this.mApproverCreate).subscribe((data:any)=> {
      console.log(data);
      this.btnOKState = false;
      this.btnOKStateLoading=false;
      if (data.data) {
        if (!data.data.error) {
          if(this.userForm.value.aprobacion == '0'){
            Swal.fire({
              icon: 'success',
              title: 'Aprobacion creada',
              confirmButtonColor: '#0A6EBD',
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Aprobacion rechazada',
              confirmButtonColor: '#0A6EBD',
            });
          }
          
          this.dialogRef.close();  
          this.obtnerLista.loadApproverTime(this.idUser);

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.data.message,
            confirmButtonColor: '#0A6EBD',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, revisa los datos.',
          confirmButtonColor: '#0A6EBD',
        });
      }
     
    }) ;
    

  }

  
  changeValue(value:boolean) {
    this.btnOKState=true;
    this.checked = !value;
    let bAprobado=false;
    //si es una aprobacion
    if(this.userForm.value.aprobacion == '0'){
      bAprobado=true;
    }


    if(bAprobado){

        //if(this.aprobador.value=='' || this.userForm.value.descripcion=='' ){
        if( this.userForm.value.descripcion=='' ){
          this.btnOKState=true;
          this.btnOKStateLoading=false;
        }else{
        this.btnOKState=false;
        }
    }else{
      //rechazado
      if(this.userForm.value.aprobacion=='' || this.userForm.value.descripcion=='' ){
        this.btnOKState=true;
        this.btnOKStateLoading=false;
      }else{
      this.btnOKState=false;
      }
    }
   
}

changingForm(){
  this.checked = false;
  this.btnOKState=true;
}
  Aproved()
    {
/*
      this.apiUser.GetAprovved(2).pipe(
        map((data: MiObjeto) => data)
        ).subscribe((data) =>{
          let listap = data["data"];
          console.log(listap)
          this.MAprobadorUser = listap.result;
          console.log(this.MAprobadorUser);
        });*/

        let sistemaGuid ='53765c41-411f-4add-9034-7debaf04f276' as unknown as Guid;
      //if it is N1 call N2
      if(this.MUser.rolEntity.nameRole=='Usuario Aprobador N1'){
        this.apiUser.GetAprovved(2, this.MUser.countryEntityId).pipe(
          map((data: MiObjeto) => data)
          ).subscribe((data) =>{
            let listap = data["data"];
            console.log(listap)
            this.MAprobadorUser = listap.result;

           
            this.MAprobadorUser=this.MAprobadorUser.filter(x => x.userEntity.idUser !=sistemaGuid);//sistema
            console.log(this.MAprobadorUser);
          });
          //is it is standar call N1
      }else if(this.MUser.rolEntity.nameRole=='Usuario estandar'){
        this.apiUser.GetAprovved(1, this.MUser.countryEntityId).pipe(
          map((data: MiObjeto) => data)
          ).subscribe((data) =>{
            let listap = data["data"];
            console.log(listap)
            this.MAprobadorUser = listap.result;
            this.MAprobadorUser=this.MAprobadorUser.filter(x => x.userEntity.idUser !=sistemaGuid);//sistema
            console.log(this.MAprobadorUser);
          });
      }
      
      
      

    }


  ngOnInit(){
    this.mApprover = this.data.object;
    this.idUser = this.data.idUser;
    console.log(this.idUser, "idUserapp")
    console.log(this.data)
}
}