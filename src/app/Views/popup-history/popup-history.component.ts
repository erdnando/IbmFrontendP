import { DatePipe } from '@angular/common';
import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { MListHorusReport } from 'src/app/Models/MListHorusReport';
import { MPopUpHistory } from 'src/app/Models/MPopUpHistory';
import { PopUpHistoryService } from 'src/app/Views/history/services/popUpHistory/pop-up-history.service';
import { Aprobacion } from 'src/app/enum/aprobacion.enum';

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
  Aprobacion = Aprobacion;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopupHistoryComponent>, private datesModal: PopUpHistoryService) {
    this.MListHorusResport = {} as MPopUpHistory;
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
      this.MListHorus = listap;
      console.log(this.MListHorus)
      console.log(this.data.reporte)
      this.MListHorusResport = listap[0];
      console.log(this.MListHorusResport);
    });


    if(this.MListHorusResport.actividad == 1){
      this.tipoHoras = "Overtime";
    }else{
      this.tipoHoras = "Standby"
    }
    
  }

}
