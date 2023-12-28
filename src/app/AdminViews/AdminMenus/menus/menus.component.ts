import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpMenusUpdateComponent } from '../pop-up-menus-update/pop-up-menus-update.component';
import { PopUpMenusCreateComponent } from '../pop-up-menus-create/pop-up-menus-create.component';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { map } from 'rxjs';
import { MMenu } from 'src/app/Models/MMenu';
import { MenusListService } from 'src/app/AdminViews/AdminRoles/services/menusList/menus-list.service';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent {

  Datos = [
    {nombre: 'Usuario'}
  ];
  
  columnasAMostrar = ['nombre'];
  
  columnas = [
    { nombre: 'nombre', titulo: 'Nombre' },
  ];
  
  MMenus: MMenu[];
  
  
  constructor(public dialog: MatDialog, private apiListMenus: MenusListService, private refresh : ObtenerlistaService) {
    this.MMenus = [];
  }
  
  openDialog(id: string, name: string) {
    this.dialog.open(PopUpMenusUpdateComponent,{
      data: {
        // Aquí puedes agregar los datos que quieras enviar
        idMenu: id,
        nameMenu: name
      }
      });
    }
  
    crearUsuario() {
      this.dialog.open(PopUpMenusCreateComponent);
    }

    ngOnInit():void{

      this.apiListMenus.GetMenu().pipe(
        map((data: MiObjeto) => data)
      ).subscribe((data) => {
        let lista = data["data"];
        this.MMenus = lista;
        console.log(this.MMenus);
        console.log(typeof ((this.MMenus[0]).nameMenu) + " verificacion")
      })

      this.refresh.refreshMenus$.subscribe((lista) => {
        this.MMenus = lista;
      });
  
      }

}
