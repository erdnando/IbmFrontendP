import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MClientEntity } from 'src/app/Models/MClienteEntity';
import { ClientCreateService } from 'src/app/AdminViews/AdminClients/services/clientCreate/client-create.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pop-up-clients-create',
  templateUrl: './pop-up-clients-create.component.html',
  styleUrls: ['./pop-up-clients-create.component.css']
})
export class PopUpClientsCreateComponent {

  MClients: MClientEntity;


  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpClientsCreateComponent>, private apicreateClient: ClientCreateService, private refreshClients: ObtenerlistaService) {
    this.MClients = {} as MClientEntity
  }

  onSubmit() {
    
    
    this.MClients.nameClient = this.userForm.value.nombre as unknown as string;
    
    console.log(this.MClients.nameClient);
    
    this.apicreateClient.PostCreateClient(this.MClients).subscribe(data=> {
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

  

}
