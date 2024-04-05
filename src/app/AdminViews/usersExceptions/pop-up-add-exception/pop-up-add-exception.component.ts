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
import { AddExceptionService } from '../service/addExceptionService/add-exception.service';
import { MUserException } from 'src/app/Models/MUserException';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-pop-up-add-exception',
  templateUrl: './pop-up-add-exception.component.html',
  styleUrls: ['./pop-up-add-exception.component.css']
})
export class PopUpAddExceptionComponent {

  mApprover: MApproverTime;
  mApproverCreate: MApproverTimeCreate;
  aprobador = new FormControl('');
  MUserEntity: MUserEntity;
  MUserEnitityException: MUserEntity;
  fechaActual = new Date();
  mUsersException: MUserException;

  userForm = new FormGroup({
    ReportType: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    horas: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PopUpAddExceptionComponent>,
  private obtnerLista: ObtenerlistaService,
  private localStorage: StorageService,
  private serviceAddException: AddExceptionService
  ) {
    this.mApprover = {} as MApproverTime;
    this.mApproverCreate = {} as MApproverTimeCreate;
    this.MUserEnitityException = localStorage.obtenerDatosMapeados();
    this.MUserEntity = {} as MUserEntity;
    this.mUsersException = {} as MUserException;
  }

  ngOnInit(){
    this.MUserEntity = this.data.user;
  }

  guardarExcepcion(){
    
    this.mUsersException.startDate = new  Date(this.userForm.value.fecha!);
    this.mUsersException.horas = Number(this.userForm.value.horas);
    this.mUsersException.description = this.userForm.value.descripcion!;
    this.mUsersException.reportType = this.userForm.value.ReportType!;
    this.mUsersException.assignedUserId = this.MUserEnitityException.idUser;
    this.mUsersException.userid = this.MUserEntity.idUser;
    
    console.log(this.mUsersException);

    this.serviceAddException.PostAddException(this.mUsersException).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Excepción Guardada Correctamente',
          confirmButtonColor: '#0A6EBD',
        });
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
