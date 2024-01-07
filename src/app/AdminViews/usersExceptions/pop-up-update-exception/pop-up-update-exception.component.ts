import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MApproverTime } from 'src/app/Models/MApproverTime';
import { MApproverTimeCreate } from 'src/app/Models/MApproverTimeCreate';
import { ApproverTimeCreateService } from 'src/app/Views/aprovve-time/services/approverTimeCreate/approver-time-create.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import { Guid } from 'guid-typescript';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { DatePipe } from '@angular/common';
import { MUserException } from 'src/app/Models/MUserException';
import { UpdateExceptionService } from '../service/updateExceptionService/update-exception-service.service';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  providers: [DatePipe],
  selector: 'app-pop-up-update-exception',
  templateUrl: './pop-up-update-exception.component.html',
  styleUrls: ['./pop-up-update-exception.component.css']
})
export class PopUpUpdateExceptionComponent {

  mApprover: MApproverTime;
  mApproverCreate: MApproverTimeCreate;
  mUsersException: MUserException;
  mUsersExceptionEdit: any;
  aprobador = new FormControl('');
  MUserEntity: MUserEntity;
  fechaActual = new Date();


  userForm = new FormGroup({
    fecha: new FormControl('', [Validators.required]),
    horas: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PopUpUpdateExceptionComponent>,
  private serviceUserExceptionUpdate: UpdateExceptionService,
  private obtnerLista: ObtenerlistaService
  ) {
    this.mApprover = {} as MApproverTime;
    this.mApproverCreate = {} as MApproverTimeCreate;
    this.MUserEntity = {} as MUserEntity;
    this.mUsersException = {} as MUserException;
  }

  ngOnInit(){
    this.MUserEntity = this.data.user.user;
    this.mUsersExceptionEdit = this.data.user;
    console.log(this.data)
    console.log(this.mUsersExceptionEdit)
    
  }

  editarExcepcion(){
    
    this.mUsersException.idUsersExceptions = this.mUsersExceptionEdit.idUsersExceptions;
    this.mUsersException.startDate = new  Date(this.userForm.value.fecha!);
    this.mUsersException.horas = Number(this.userForm.value.horas);
    this.mUsersException.description = this.userForm.value.descripcion!;
    this.mUsersException.assignedUserId = this.mUsersExceptionEdit.assignedUserId;
    this.mUsersException.userid = this.MUserEntity.idUser;
    
    console.log(this.mUsersException);

    this.serviceUserExceptionUpdate.PostUpdateException(this.mUsersException).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Excepción Editada Correctamente',
          confirmButtonColor: '#0A6EBD',
        });
        this.obtnerLista.loadListUsersExceptions();
        this.dialogRef.close();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, los datos no se pudieron cambiar',
          confirmButtonColor: '#0A6EBD',
        });
      }
    }) ;

  }

  
}
