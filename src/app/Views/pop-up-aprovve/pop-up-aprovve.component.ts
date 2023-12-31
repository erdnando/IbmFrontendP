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
  private obtnerLista: ObtenerlistaService
  ) {
    this.mApprover = {} as MApproverTime;
    this.mApproverCreate = {} as MApproverTimeCreate;
    this.Aproved();
    this.MAprobadorUser =[];
    this.Aproved();
    this.MAprobadorUser =[];
  }

  crearAprobacion(){

    console.log(this.userForm.value.aprobacion);
    this.mApproverCreate.horusReportEntityId = this.mApprover.horusReportEntityId;
    this.mApproverCreate.state = parseInt(this.userForm.value.aprobacion!);
    this.mApproverCreate.description = this.userForm.value.descripcion!;
    if(this.userForm.value.aprobacion == '1'){
      this.mApproverCreate.userId = this.aprobador.value as unknown as Guid;
    }else{
      this.mApproverCreate.userId = '00000000-0000-0000-0000-000000000000' as unknown as Guid;
    }

    
    

    this.serviceApproverTimeCreate.PostCreateApproverTime(this.mApproverCreate).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Aprobacion creada',
          confirmButtonColor: '#0A6EBD',
        });
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
  }
}