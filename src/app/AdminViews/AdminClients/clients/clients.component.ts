import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpClientsUpdateComponent } from '../pop-up-clients-update/pop-up-clients-update.component';
import { PopUpClientsCreateComponent } from '../pop-up-clients-create/pop-up-clients-create.component';
import { ClientService } from 'src/app/AdminViews/AdminClients/services/client/client.service';
import { MClientEntity } from 'src/app/Models/MClienteEntity';
import { Subscription, map } from 'rxjs';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';


interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  Datos = [
    {nombre: 'Usuario'}
  ];
  
  columnasAMostrar = ['nombre'];
  
  columnas = [
    { nombre: 'nombre', titulo: 'Nombre' },
    
    
  ];
  
  MClients: MClientEntity[];
  suscription: Subscription;
  MUser: MUserEntity;
  Approving: boolean = false;
  
  constructor(public dialog: MatDialog, private serviceLists: ObtenerlistaService,private storageService: StorageService) {
    this.MClients = [];
    this.suscription = new Subscription();
    this.MUser = this.storageService.obtenerDatosMapeados();

  }
  
    openDialog(id: string, nameClient: string) {
      this.dialog.open(PopUpClientsUpdateComponent,{
        data: {
          // Aquí puedes agregar los datos que quieras enviar
          idClient: id,
          nameClient: nameClient
        }
        });
    }
  
    crearUsuario() {
      this.dialog.open(PopUpClientsCreateComponent);
    }

    ngOnInit():void{

      this.serviceLists.loadClients().subscribe((clients) => {
        this.MClients = clients;
      console.log(this.MClients+"loadClients");
      console.log(typeof ((this.MClients[0]).idClient) + " verificacion")
      });

      this.serviceLists.refreshClients$.subscribe((lista) => {
        this.MClients = lista;
        console.log(lista[0].idClient+ "refreshClients")
      });

      this.validateRole();
      
      
      }

      validateRole(){
        if (this.MUser.rolEntity.nameRole == 'Administrador'||this.MUser.rolEntity.nameRole =='Super Administrador') {
          this.Approving = true;
        }
      }

}
