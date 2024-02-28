import { DatePipe } from '@angular/common';
import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { MListHorusReport } from 'src/app/Models/MListHorusReport';
import { MPopUpHistory } from 'src/app/Models/MPopUpHistory';
import { PopUpHistoryService } from 'src/app/Views/history/services/popUpHistory/pop-up-history.service';
import { Aprobacion2 } from 'src/app/enum/aprobacion.enum';

interface MiObjetoApp {
  [key: string]: any;
}

@Component({
  providers: [DatePipe],
  selector: 'app-popup-history',
  templateUrl: './popup-history.component.html',
  styleUrls: ['./popup-history.component.css']
})
export class PopupHistoryComponent {

  Datos = [
    {aprobador1: 'Aprobado', aprobador2: '---', estado: 'En proceso'}
  ];

  columnasAMostrar1 = ['aprobador1',  'estado'];
  columnasAMostrar2 = [ 'aprobador2', 'estado'];
  columnasAMostrar = [ 'aprobador1','aprobador2', 'estado'];

  MListHorus: MPopUpHistory[] = [];
  MListHorusResport: MPopUpHistory;
  tipoHoras: string = "";
  procedencia : string = "";
  Aprobacion = Aprobacion2;
  assignments: any[] = [];
  startTime:string;
  endTime:string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopupHistoryComponent>, private datesModal: PopUpHistoryService) {
    this.MListHorusResport = {} as MPopUpHistory;
    this.startTime="";
    this.endTime="";
  }

  getColor(estado: string): string {
    switch (estado) {
      case "AprobadoN0":
      case "AprobadoN1":
      case "AprobadoN2":
        return '#219C90';
      case "Rechazado":
      case "Descartado":
          return '#D83F31';
      case "Pendiente":
          return '#E9B824';
      default:
          return '';
  }
}

cargarIcono(estado: string): string{
  switch (estado) {
    case "AprobadoN0":
    case "AprobadoN1":
    case "AprobadoN2":
      return 'check_circle';
    case "Rechazado":
    case "Descartado":
        return 'cancel';
    case "Pendiente":
        return 'schedule';
    default:
        return '';
}
}

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    let idHours = this.data.reporte;
    this.procedencia = this.data.procede; 
    
    this.datesModal.GetDatesModal(idHours).pipe(
      map((data: MiObjetoApp) => data)
    ).subscribe((data) => {
      let listap = data["data"];
      console.log("listap::::");
      console.log(listap);

      this.MListHorus = listap;
      console.log("MListHorus::::");
      console.log(this.MListHorus);

      this.assignments = listap[0].assignments;
      console.log("this.assignments[0].horusReportEntity::::");
      console.log(this.assignments[0].horusReportEntity.startTime);
      console.log(this.assignments[0].horusReportEntity.endTime);
      this.startTime=this.assignments[0].horusReportEntity.startTime;
      this.endTime=this.assignments[0].horusReportEntity.endTime;

      //console.log(this.MListHorus)
      console.log(this.data.reporte)
      console.log("data.reporte::::");
      console.log(this.data.reporte);

      this.MListHorusResport = listap[0];
      console.log("MListHorusResport::::");
      console.log(this.MListHorusResport);



      if(this.MListHorusResport.actividad == 1){
        this.tipoHoras = "Overtime";
      }else{
        this.tipoHoras = "Standby"
      }


    });


   
    
  }

}
