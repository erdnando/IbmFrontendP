import { Component, Inject } from '@angular/core';
import { Form, FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Guid } from 'guid-typescript';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { MMenu } from 'src/app/Models/MMenu';
import { MRol } from 'src/app/Models/MRol';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { RolesCreateService } from 'src/app/AdminViews/AdminRoles/services/rolesCreate/roles-create.service';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

@Component({
  selector: 'app-pop-up-roles-create',
  templateUrl: './pop-up-roles-create.component.html',
  styleUrls: ['./pop-up-roles-create.component.css']
})
export class PopUpRolesCreateComponent {



  checked = false;
  MRol: MRol;
  MMenu: MMenu[];
  MMenus: MMenu ;
  menus = new FormControl('');
  botonAhgregarMenus = false;
  menusList: number[] = [0];
  listaMenus: MMenu [];
  MMenuf: MMenu;
  MUser: any;

  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    menu: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpRolesCreateComponent>, 
  private apicreateRol: RolesCreateService, private serviceLists: ObtenerlistaService,
  private _formBuilder: FormBuilder, private refresh: ObtenerlistaService,
  private storageData: StorageService) {
    this.MRol = {} as MRol;
    this.MMenu = [];
    this.listaMenus = [];
    this.MMenus = {} as MMenu;
    this.MMenuf = {} as MMenu;
    this.MUser = this.storageData.obtenerDatosMapeados();
  }

  onSubmit() {

    this.MRol.nameRole = this.userForm.value.nombre as unknown as string;
    this.MRol.menuEntity = this.listaMenus;
    this.MRol.idUserEntiyId=this.MUser!.idUser;
    console.log(this.MRol.nameRole);

    this.apicreateRol.PostCreateRol(this.MRol).subscribe(data=> {
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

  alertFormValues(idmenu: Guid) {
    alert(JSON.stringify(idmenu, null, 2));
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

  agregarMenu(): void {
    this.menusList.push(this.menusList.length);  // Añade un índice al final del array
    this.MMenus.idMenu = this.userForm.value.menu as unknown as Guid;
        this.listaMenus.push(this.MMenus)
  }

  select(plan: any) {

    if (this.menus.value !== null) {
        this.botonAhgregarMenus = true;
    } else {
      console.log('El valor de pais es null');
    }
  }


  onClose(): void {
    this.dialogRef.close();
  }

    ngOnInit(){
  this.serviceLists.loadMenus().subscribe((menus) => {
    this.MMenu = menus;
  console.log(this.MMenu);
  });
}

}
