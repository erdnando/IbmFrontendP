import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAprobador } from 'src/app/Models/MAprobador';
import { ApproverCreateService } from 'src/app/AdminViews/AdminApprover/services/approverCreate/approver-create.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pop-up-schedule-create',
  templateUrl: './pop-up-schedule-create.component.html',
  styleUrls: ['./pop-up-schedule-create.component.css']
})



export class PopUpScheduleCreateComponent {

  MApprover: MAprobador;

  userForm = new FormGroup({
    descripcion: new FormControl('', [Validators.required]),
    nivel: new FormControl('', [Validators.required])
  });

  constructor(public dialogRef: MatDialogRef<PopUpScheduleCreateComponent>, private apicreateApprover: ApproverCreateService, private refreshClients: ObtenerlistaService) {
    this.MApprover = {} as MAprobador;
  }

  onSubmit() {
    
    this.MApprover.descripcion = this.userForm.value.descripcion as unknown as string;
    this.MApprover.nivel = Number(this.userForm.value.nivel);
    
    console.log(this.MApprover.descripcion);
    console.log(typeof this.MApprover.nivel);
    
    this.apicreateApprover.PostCreateApprover(this.MApprover).subscribe(data=> {
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

}
