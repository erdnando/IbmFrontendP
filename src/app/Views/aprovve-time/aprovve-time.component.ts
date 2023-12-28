import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpAprovveComponent } from '../pop-up-aprovve/pop-up-aprovve.component';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { Guid } from 'guid-typescript';
import { ApproverTimeService } from 'src/app/Views/aprovve-time/services/approverTime/approver-time.service';
import { map } from 'rxjs';
import { MApproverTime } from 'src/app/Models/MApproverTime';
import { Aprobacion } from 'src/app/enum/aprobacion.enum';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { DatePipe } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
    'empleado',
    'identificacion',
    'horas',
    'estado',
  ];

  Approving: boolean = false;
  listadoUsuarios: any[] = [];
  mApproverTime: MApproverTime[] = [];
  botonfiltrado: number = 0;
  Aprobacion = Aprobacion;

  filtrarDatos(boton: string) {
    console.log(boton);
    console.log('prueba ');
    if (boton == 'aprobadas') {
      this.botonfiltrado = 1;
    } else if (boton == 'rechazadas') {
      this.botonfiltrado = 2;
    } else {
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
    this.ValidateRole();
    this.obtenerLista.refreshAppTime$.subscribe(lista => {
      this.mApproverTime = lista;
      console.log(this.mApproverTime);
    });
  }

  ValidateRole() {
    if (this.MUser.rolEntity.nameRole == 'Usuario Aprobador N1' ||this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2') {
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
        case "Aprobado":
            return '#219C90';
        case "Rechazado":
            return '#D83F31';
        case "Pendiente":
            return '#E9B824';
        default:
            return '';
    }
}

  cargarIcono(estado: string): string{
    switch (estado) {
      case "Aprobado":
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
    if (event.index === 1) { 
        this.botonPresionado = 'aprobadas';
    }
    if (event.index === 0) { 
      this.botonPresionado = 'pendientes';
  }
  if (event.index === 2) { 
    this.botonPresionado = 'rechazadas';
}
   
}

}
