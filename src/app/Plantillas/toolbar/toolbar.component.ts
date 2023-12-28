import { Component } from '@angular/core';
import {Router} from '@angular/router'
import { map } from 'rxjs';
import { LoadToolbarService } from "./services/LoadToolbar/LoadToolbar.service"
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { MMenu } from 'src/app/Models/MMenu';
import { MRolMenu } from 'src/app/Models/MRolMenu';
interface MiObjetoApp{
  [key: string]: any;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  MUser: MUserEntity;
  Mmen : MRolMenu[];
  mostrarNuevosBotones = false

  constructor(private storageService: StorageService,private router:Router,private loadToolbarService:LoadToolbarService)
  {
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.Mmen = [] as MRolMenu[];
    this.cergarMenuList();
  }
  showInfo(link:string){
    console.log("entro");
    this.router.navigate([link])
  }

  async cergarMenuList (){

    this.MUser = this.storageService.obtenerDatosMapeados();
    (await this.loadToolbarService.PostLoadToolbar(this.MUser.roleEntityId)).pipe(
      map((data: MiObjetoApp) => data)
      ).subscribe((data) =>{
        let listap = data["data"];
        console.log(listap)
        this.Mmen = listap;
        console.log(this.Mmen);
      });

    }

  Redireccion(){
    console.log("entro");
    this.router.navigate(['user'])
  }
  Redireccion1(){
    console.log("entro");
    this.router.navigate(['resgitertime'])
  }
  Redireccion2(){
    console.log("entro");
    this.router.navigate(['history'])
  }
  Redireccion3(){
    console.log("entro");
    this.router.navigate(['aproveetime'])
  }
  Redireccion4(){
    console.log("entro");
    this.router.navigate(['parameters'])
  }
  Redireccion5(){
    console.log("entro");
    this.router.navigate(['profiles'])
  }
  Redireccion6(){
    console.log("entro");
    this.router.navigate(['registers'])
  }
  Redireccion7(){
    console.log("entro");
    this.router.navigate(['arpcomponent'])
  }
  Redireccion8(){
    console.log("entro");
    this.mostrarNuevosBotones = true;
  }
  Redireccion9(){
    console.log("entro");
    this.router.navigate(['admin/users'])
  }
  Redireccion10(){
    console.log("entro");
    this.router.navigate(['admin/clients'])
  }
  Redireccion11(){
    console.log("entro");
    this.router.navigate(['admin/approvers'])
  }
  Redireccion12(){
    console.log("entro");
    this.router.navigate(['admin/countries'])
  }
  Redireccion13(){
    console.log("entro");
    this.router.navigate(['admin/menus'])
  }
  Redireccion14(){
    console.log("entro");
    this.router.navigate(['admin/roles'])
  }
  Redireccion15(){
    console.log("entro");
    this.mostrarNuevosBotones = false;
  }


  }






