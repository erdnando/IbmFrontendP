import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { MClientEntity } from 'src/app/Models/MClienteEntity';
import { MMenu } from 'src/app/Models/MMenu';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MenusUpdateService } from 'src/app/AdminViews/AdminRoles/services/menusUpdate/menus-update.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pop-up-menus-update',
  templateUrl: './pop-up-menus-update.component.html',
  styleUrls: ['./pop-up-menus-update.component.css']
})
export class PopUpMenusUpdateComponent {

  MMenu: MMenu;
  idMenu: string = "";
  nameMenu: string = "";

  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpMenusUpdateComponent>, private apiMenuUpdate: MenusUpdateService, private refresh: ObtenerlistaService) {
    this.MMenu = {} as MMenu;
  }

  onSubmit() {
    
    this.MMenu.idMenu = this.idMenu as unknown as Guid;
    this.MMenu.nameMenu = this.userForm.value.nombre as unknown as string;
    this.MMenu.icon = "setting";
    this.MMenu.path = "parameters";
    

    console.log(this.MMenu.idMenu);
    console.log(this.MMenu.nameMenu);
    
    this.apiMenuUpdate.PostCreateMenu(this.MMenu).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados Correctamente',
        });
        this.refresh.loadMenusRefresh();
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

  ngOnInit() {

    this.idMenu = this.data.idMenu;
    this.nameMenu = this.data.nameMenu;
  }


}
