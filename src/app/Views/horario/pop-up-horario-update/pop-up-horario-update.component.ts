import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { MAprobador } from 'src/app/Models/MAprobador';
import { MClientEntity } from 'src/app/Models/MClienteEntity';
import { ClientUpdateService } from 'src/app/AdminViews/AdminClients/services/clientUpdate/client-update.service';
import Swal from 'sweetalert2';
import { HorarioComponent } from '../horario/horario.component';
import { ApproverUpdateService } from 'src/app/AdminViews/AdminApprover/services/approverUpdate/approver-update.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

@Component({
  selector: 'app-pop-up-horario-update',
  templateUrl: './pop-up-horario-update.component.html',
  styleUrls: ['./pop-up-horario-update.component.css']
})
export class PopUpHorarioUpdateComponent {

  MApprover: MAprobador;
  idAprobador: string = "";
  descripciones: string = "";
  nivel: number = 0;
  MUser: any;

  userForm = new FormGroup({
    descripcion: new FormControl('', [Validators.required]),
    nivel: new FormControl('', [Validators.required])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpHorarioUpdateComponent>, 
  private apiupdateApprover: ApproverUpdateService, private refreshClients: ObtenerlistaService,
  private storageData: StorageService) {
    this.MApprover = {} as MAprobador;
    this.MUser = this.storageData.obtenerDatosMapeados();
  }

  onSubmit() {
    
    this.MApprover.idAprobador =  this.idAprobador as unknown as Guid;
    this.MApprover.descripcion = this.userForm.value.descripcion as unknown as string;
    this.MApprover.nivel = Number(this.userForm.value.nivel);
    this.MApprover.idUserEntiyId=this.MUser!.idUser;
    console.log(this.MApprover.descripcion);
    console.log(typeof this.MApprover.nivel);
    
    this.apiupdateApprover.PostUpdateApprover(this.MApprover).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados Correctamente',
          confirmButtonColor: '#0A6EBD',
        });
        this.refreshClients.loadApproversRefresh();
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


  onClose(): void {
    this.dialogRef.close();
  }
  
  ngOnInit() {

    this.idAprobador = this.data.idApprover;
    this.descripciones = this.data.descripcion;
    this.nivel = this.data.nivel;

    console.log(this.idAprobador);
    console.log( this.descripciones);
    console.log( this.nivel);
  }
}
