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
    
    this.apiUpdateRol.PostUpdateRol(this.MRol).subscribe(data=> {
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
    this.MMenuf = {} as MMenu;
    this.MMenuf.idMenu = idmenu;
    var n = this.listaMenus.includes(this.MMenuf);
    if(!n && !$event.checked)
    {
      var indexofmenu = this.listaMenus.findIndex(x => x.idMenu == idmenu);
      this.listaMenus.splice(indexofmenu, 1);
    }
    else if(!n && $event.checked)
    {
      this.listaMenus.push(this.MMenuf)
    }
  }


  ngOnInit() {

    this.idRol = this.data.idRol;
    this.nameRol = this.data.nameRol;
    this.refresh.loadMenus().subscribe((menus) => {
      if(menus === null || menus === undefined){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, no se pudo obtener informacion de los menus.',
          confirmButtonColor: '#0A6EBD',
        });
      }
      this.MMenu = menus;
      this.cargarMenuRolSeleccionado();
    });
  }

  cargarMenuRolSeleccionado(){
    const idRolParam = Guid.parse(this.idRol);

    this.refresh.loadMenusByRol(idRolParam).subscribe((menus) => {

      if(menus === null || menus === undefined){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, no se pudo obtener informacion de los menus del rol.',
          confirmButtonColor: '#0A6EBD',
        });
      }

      this.MMenu.map((e)=>{
        let menu = menus.find(m=>m.menuEntityId === e.idMenu);
        if(menu){
          e.seleccionado = true;
          this.MMenuf = {} as MMenu;
          this.MMenuf.idMenu = e.idMenu;
          this.listaMenus.push(this.MMenuf)
        }
      });

    });
  }

}
