import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpApproverUpdateComponent } from '../pop-up-approver-update/pop-up-approver-update.component';
import { PopUpApproverCreateComponent } from '../pop-up-approver-create/pop-up-approver-create.component';
import { ApproverListService } from 'src/app/AdminViews/AdminApprover/services/approverList/approver-list.service';
import { MAprobador } from 'src/app/Models/MAprobador';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';


@Component({
  selector: 'app-approver',
  templateUrl: './approver.component.html',
  styleUrls: ['./approver.component.css']
})
export class ApproverComponent {

  Datos = [
    {nombre: 'Juan Romero', email: 'correo@gmail.com ', cargo: 'Aprobador', rol: 'usuario', pais: 'Colombia'}
  ];
  
  columnasAMostrar = ['descripcion', 'nivel'];
  
  columnas = [
    { nombre: 'descripcion', titulo: 'Descripcion' },
    { nombre: 'nivel', titulo: 'Nivel' },
    
  ];
  
  MApprover: MAprobador[];
  a : MAprobador[];
  MUser: MUserEntity;
  Approving: boolean = false;

  
  constructor(public dialog: MatDialog, private serviceLists: ObtenerlistaService,private storageService: StorageService) {
    this.MApprover = [];
    this.a = []
    this.MUser = this.storageService.obtenerDatosMapeados();

  }
  
  openDialog(id: string, name: string, nivel: any) {
    this.dialog.open(PopUpApproverUpdateComponent,{
      data: {
        // Aquí puedes agregar los datos que quieras enviar
        idApprover: id,
        descripcion: name,
        nivel: nivel
      }
      });
  }

  crearUsuario() {
    this.dialog.open(PopUpApproverCreateComponent);
  }

  ngOnInit():void{

    this.serviceLists.loadApprovers().subscribe((approvers) => {
      this.MApprover = approvers;
    console.log(this.MApprover);
    console.log(typeof ((this.MApprover[0]).idAprobador) + " verificacion")
    });

    this.serviceLists.refreshApprovers$.subscribe((lista) => {
      this.MApprover= lista;
    });

    this.validateRole();
    }

    validateRole(){
      if (this.MUser.rolEntity.nameRole == 'Administrador'||this.MUser.rolEntity.nameRole =='Super Administrador') {
        this.Approving = true;
      }
    }

}
