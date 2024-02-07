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
   // this.Aproved();
    //this.MAprobadorUser =[];
  }

  crearAprobacion(){

    console.log(this.userForm.value.aprobacion);
    this.mApproverCreate.roleAprobador=this.MUser.rolEntity.nameRole;
    this.mApproverCreate.horusReportEntityId = this.mApprover.horusReportEntityId;
    this.mApproverCreate.description = this.userForm.value.descripcion!;


    this.mApproverCreate.state = parseInt(this.userForm.value.aprobacion!);
   /* if(this.MUser.rolEntity.nameRole=='Usuario Aprobador N2'){
        this.mApproverCreate.state = parseInt(this.userForm.value.aprobacion!);
    }else{
      this.mApproverCreate.state =0;
    }*/
    

    //aprovador 2 -camilo

    //si se eligio aprobado
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
        this.mApproverCreate.userId = '00000000-0000-0000-0000-000000000000' as unknown as Guid;
        this.mApproverCreate.aprobador2UserEntityId=  '00000000-0000-0000-0000-000000000000' as unknown as Guid;
      }



    }else{
      //rechazado

      this.mApproverCreate.userId = '00000000-0000-0000-0000-000000000000' as unknown as Guid;
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

    this.serviceApproverTimeCreate.PostCreateApproverTime(this.mApproverCreate).subscribe(data=> {
      console.log(data);
      if (data.data) {

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
        this.obtnerLista.loadApproverTime(this.idUser)
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

  Aproved()
    {
      this.apiUser.GetAprovved(2).pipe(
        map((data: MiObjeto) => data)
        ).subscribe((data) =>{
          let listap = data["data"];
          console.log(listap)
          this.MAprobadorUser = listap.result;
          console.log(this.MAprobadorUser);
        });
      

    }


  ngOnInit(){
    this.mApprover = this.data.object;
    this.idUser = this.data.idUser;
    console.log(this.idUser, "idUserapp")
    console.log(this.data)
  }
}