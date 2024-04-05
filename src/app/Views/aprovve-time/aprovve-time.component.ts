import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpAprovveComponent } from '../pop-up-aprovve/pop-up-aprovve.component';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { Guid } from 'guid-typescript';
import { ApproverTimeService } from 'src/app/Views/aprovve-time/services/approverTime/approver-time.service';
import { map } from 'rxjs';
import { MApproverTime } from 'src/app/Models/MApproverTime';
import { Aprobacion2 } from 'src/app/enum/aprobacion.enum';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { DatePipe } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  providers: [DatePipe],
  selector: 'app-aprovve-time',
  templateUrl: './aprovve-time.component.html',
  styleUrls: ['./aprovve-time.component.css'],
})
export class AprovveTimeComponent {
  botonPresionado: string = 'pendientes'; 


  MUser: MUserEntity;

  columnasAMostrar = [
    'fechaEnvio',
    'reporte',
    'identificacion',
    'empleado',
    'horas',
    'horaInicio',
    'horaFinal',
    'estado',
  ];

  Approving: boolean = false;
  listadoUsuarios: any[] = [];
  mApproverTime: MApproverTime[] = [];
  botonfiltrado: number = 1;
  Aprobacion = Aprobacion2;
  isLoading: boolean =false;

  inconsistencesDS: MatTableDataSource<any> = new MatTableDataSource();
  inconsistencesColumnsToDisplay = ['codigoPais', 'employeeCode', 'employeeName', 'employeeEmail', 'managerName', 'managerEmail', 'creationDate', 'startDateTime', 'endDateTime', 'report', 'activity', 'totalHours', 'tool', 'status', 'comments'];

  filtrarDatos(boton: string) {

     if (boton == 'pendientes') {

      this.botonfiltrado = 0; 
      
     
    }else if (boton == 'aprobadasN1') {
      this.botonfiltrado = 1; 
    }else if (boton == 'aprobadasN2') {
      this.botonfiltrado = 2; 
    }else if (boton == 'rechazadas') {
      this.botonfiltrado = 3;
    } 


    return this.mApproverTime.filter((dato) => dato.state === this.botonfiltrado);
  }

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private consultApproverTime: ApproverTimeService,
    private obtenerLista: ObtenerlistaService
  ) {
    this.MUser = this.storageService.obtenerDatosMapeados();
  }
  ngOnInit() {
    this.isLoading=true;
    this.ValidateRole();
    this.obtenerLista.refreshAppTime$.subscribe(lista => {
      
      this.mApproverTime = lista;
      console.log("mApproverTime::::");
      console.log(this.mApproverTime);
      this.isLoading=false;
    });

    this.obtenerLista.loadListInconsistencies(null, this.MUser.employeeCode);
    this.obtenerLista.refreshInconsistence$.subscribe(lista => {
      this.inconsistencesDS.data = lista;
      this.isLoading=false;
    });
  }

  ValidateRole() {
    if (this.MUser.rolEntity.nameRole == 'Usuario estandar' || this.MUser.rolEntity.nameRole == 'Usuario Aprobador N1' ||this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2' || this.MUser.rolEntity.nameRole == 'Administrador'||this.MUser.rolEntity.nameRole =='Super Administrador') {
      this.Approving = true;
      this.obtenerLista.loadApproverTime(this.MUser.idUser);
       
    }
  }

  openDialog(element: any) {
    this.dialog.open(PopUpAprovveComponent, {
      data: {
        object: element,
        idUser: this.MUser.idUser
      },
    });
  }

  getColor(estado: string): string {
    switch (estado) {
        case "AprobadoN1":
            return '#219C90';
        case "AprobadoN2":
              return '#219C90';
        case "rechazado":
            return '#D83F31';
        case "Pendiente":
            return '#E9B824';
        default:
            return '';
    }
}

  cargarIcono(estado: string): string{
    switch (estado) {
      case "AprobadoN1":
          return 'check_circle';
          case "AprobadoN2":
            return 'check_circle';
      case "Rechazado":
          return 'cancel';
      case "Pendiente":
          return 'schedule';
      default:
          return '';
  }
  }

  onTabChanged(event: MatTabChangeEvent) {
    console.log('--->'+event.index);


    if (this.MUser.rolEntity.nameRole == 'Usuario Aprobador N1'){
          if (event.index === 0) { 
            this.botonPresionado = 'pendientes';
            }
            if (event.index === 1) { 
              this.botonPresionado = 'aprobadasN1';
          }
            if (event.index === 2) { 
              this.botonPresionado = 'rechazadas';
          }
         

    }else if (this.MUser.rolEntity.nameRole == 'Usuario estandar'  || this.MUser.rolEntity.nameRole == 'Administrador' || this.MUser.rolEntity.nameRole == 'Super Administrador'){
      if (event.index === 0) { 
        this.botonPresionado = 'pendientes';
        }
        if (event.index === 1) { 
          this.botonPresionado = 'aprobadasN1';
      }
        if (event.index === 2) { 
          this.botonPresionado = 'rechazadas';
      }
      if (event.index === 3) { 
        this.botonPresionado = 'rechazadas';
      
      }
    }else if (this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2' ){
      if (event.index === 0) { 
        this.botonPresionado = 'pendientes';
        }
        if (event.index === 1) { 
          this.botonPresionado = 'aprobadasN2';
      }
        if (event.index === 2) { 
          this.botonPresionado = 'rechazadas';
      }
     
    }
    
   
}

}
