import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MMenu } from 'src/app/Models/MMenu';
import { MenusCreateService } from 'src/app/AdminViews/AdminRoles/services/menusCreate/menus-create.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pop-up-menus-create',
  templateUrl: './pop-up-menus-create.component.html',
  styleUrls: ['./pop-up-menus-create.component.css']
})
export class PopUpMenusCreateComponent {

  MMenu: MMenu;


  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  constructor(public dialogRef: MatDialogRef<PopUpMenusCreateComponent>, private apiCreateMenu: MenusCreateService, private refresh: ObtenerlistaService) {
    this.MMenu = {} as MMenu;
  }

  onSubmit() {
    
    
    this.MMenu.nameMenu= this.userForm.value.nombre as unknown as string;
    this.MMenu.icon = "setting";
    this.MMenu.path = "parameters";
    
    console.log(this.MMenu.nameMenu);
    
    this.apiCreateMenu.PostCreateMenu(this.MMenu).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados Correctamente',
        });
        this.refresh.loadMenusRefresh()
        this.dialogRef.close();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, los datos no se pudieron cambiar',
        });
      }
    }) ;


  }


  onClose(): void {
    this.dialogRef.close();
  }

}
