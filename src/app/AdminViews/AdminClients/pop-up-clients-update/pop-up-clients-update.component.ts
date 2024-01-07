import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { MClientEntity } from 'src/app/Models/MClienteEntity';
import { ClientUpdateService } from 'src/app/AdminViews/AdminClients/services/clientUpdate/client-update.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pop-up-clients-update',
  templateUrl: './pop-up-clients-update.component.html',
  styleUrls: ['./pop-up-clients-update.component.css']
})
export class PopUpClientsUpdateComponent {

  MClient: MClientEntity;
  idClient: string = "";
  nameClient: string = "";

  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpClientsUpdateComponent>, private apiClientUpdate: ClientUpdateService, private refreshClients: ObtenerlistaService) {
    this.MClient = {} as MClientEntity;
  }

  onSubmit() {
    
    this.MClient.idClient = this.idClient as unknown as Guid;
    this.MClient.nameClient = this.userForm.value.nombre as unknown as string;
    

    console.log(this.MClient.idClient);
    console.log(this.MClient.nameClient);
    
    this.apiClientUpdate.PostUpdateClient(this.MClient).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados Correctamente',
          confirmButtonColor: '#0A6EBD',
        });
        this.refreshClients.loadClientsRefresh();
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

    this.idClient = this.data.idClient;
    this.nameClient = this.data.nameClient
  }

}
