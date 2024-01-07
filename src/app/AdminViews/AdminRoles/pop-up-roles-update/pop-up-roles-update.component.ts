import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Guid } from 'guid-typescript';
import { map } from 'rxjs';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { MMenu } from 'src/app/Models/MMenu';
import { MRol } from 'src/app/Models/MRol';
import { ListCountryService } from 'src/app/AdminViews/AdminCountries/services/list-country/list-country.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { ApiParameters } from 'src/app/Views/parameters/services/parameters/api.parameters';
import { RolesUpdateService } from 'src/app/AdminViews/AdminRoles/services/rolesUpdate/roles-update.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pop-up-roles-update',
  templateUrl: './pop-up-roles-update.component.html',
  styleUrls: ['./pop-up-roles-update.component.css']
})
export class PopUpRolesUpdateComponent {

  MRol: MRol;
  idRol: string = "";
  nameRol: string = "";
  MMenu: MMenu[];
  MMenus: MMenu ;
  listaMenus: MMenu [] = [];
  MMenuf: MMenu;


  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpRolesUpdateComponent>, private apiUpdateRol: RolesUpdateService, private refresh: ObtenerlistaService) {
    this.MRol = {} as MRol;
    this.MMenuf = {} as MMenu;
    this.MMenu = [];
    this.MMenus = {} as MMenu;
  }

  onSubmit() {
    
    this.MRol.idRole = this.idRol as unknown as Guid;
    this.MRol.nameRole = this.userForm.value.nombre as unknown as string;
    this.MRol.menuEntity = this.listaMenus;
  
    console.log(this.MRol.idRole);
    console.log(this.MRol.nameRole);
    
    this.apiUpdateRol.PostUpdateRol(this.MRol).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados Correctamente',
          confirmButtonColor: '#0A6EBD',
        });
        this.refresh.loadRolesRefresh();
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

  changed(idmenu: Guid,$event: MatSlideToggleChange){
    console.log(idmenu);
    console.log($event.checked);
    this.MMenuf = {} as MMenu;
    this.MMenuf.idMenu = idmenu;
    var n = this.listaMenus.includes(this.MMenuf);
    console.log(n);
    if(!n && !$event.checked)
    {
      var indexofmenu = this.listaMenus.indexOf(this.MMenuf);
      this.listaMenus.splice(indexofmenu);
      console.log("Eliminado")
      console.log(this.listaMenus);
    }
    else if(!n && $event.checked)
    {
      this.listaMenus.push(this.MMenuf)
      console.log("Añadido")
      console.log(this.listaMenus);
    }


  }


  ngOnInit() {

    this.idRol = this.data.idRol;
    this.nameRol = this.data.nameRol;
    this.refresh.loadMenus().subscribe((menus) => {
      this.MMenu = menus;
    console.log(this.MMenu);
    });
  }
  

}
