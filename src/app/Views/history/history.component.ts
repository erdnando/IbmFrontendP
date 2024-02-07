import { Component, ViewChild } from '@angular/core';
import { PopupHistoryComponent } from '../popup-history/popup-history.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiHistory } from './services/history/api.history'
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { map } from 'rxjs';
import { MListHorusReport } from 'src/app/Models/MListHorusReport';
import { Guid } from 'guid-typescript';
import { Aprobacion2 } from 'src/app/enum/aprobacion.enum';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';

interface MiObjetoApp{
  [key: string]: any;
}

@Component({
  providers: [DatePipe],
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent {

  columnasAMostrar = ['fechaEnvio','creationDate', 'cliente', 'reporte', 'aprobador', 'horas','estado'];

  selectedCountry: string = '';
  MUser: MUserEntity;
  mListHorusReport = new MatTableDataSource<any>();
  Aprobacion = Aprobacion2;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterValue: string = '';

  ngOnInit() {
    this.selectedCountry = this.rutaActual.globalVar;
  }

  ngAfterViewInit() {
    this.mListHorusReport.paginator = this.paginator;
  }

  constructor(private storageService: StorageService,public dialog: MatDialog,private apiHistory:ApiHistory, private rutaActual: RutaActualService) {

    this.MUser = this.storageService.obtenerDatosMapeados();
    this.cergarlist();
    
  }


  openDialog(id: Guid) {
    this.dialog.open(PopupHistoryComponent,{
      data: {
        reporte: id
      }
    });
  }

  getColor(estado: string): string {
    switch (estado) {
        case "AprobadoN1":
            return '#219C90';
            case "AprobadoN2":
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

  async cergarlist (){

  (await this.apiHistory.PostListReport(this.MUser.idUser)).pipe(
    map((data: MiObjetoApp) => data)
    ).subscribe((data) =>{
      let listap = data["data"];

      console.log(listap);
      this.mListHorusReport.data = listap;
      let ListaFilt = listap;

      /*
      if (this.MUser.rolEntity.nameRole != 'Super Administrador') {
        ListaFilt = listap.filter((x: any) => x.userEntity.countryEntity.nameCountry == this.selectedCountry);
      }

      if (this.MUser.rolEntity.nameRole != 'Administrador' && this.MUser.rolEntity.nameRole != 'Super Administrador') {
        ListaFilt = ListaFilt.filter((x: any) => {x.userEntityId == this.MUser.idUser});
      }*/

      this.mListHorusReport.data = ListaFilt;
    });

  }

  //----new------------------
  applyFilter(event: any) {

    this.filterValue = (event.target as HTMLInputElement).value;
    this.mListHorusReport.filterPredicate = (data: any, filter: string) => {
      console.log(data);

      const approverId = data.approverId.toLowerCase().includes(filter);
      const nameClient = data.clientEntity.nameClient.toLowerCase().includes(filter);
      const numberReport = data.numberReport.toString().toLowerCase().includes(filter);
      const creationDate = data.creationDate.toString().toLowerCase().includes(filter);
      
      
      return approverId || nameClient || numberReport || creationDate;
    };
    this.mListHorusReport.filter = this.filterValue.trim().toLowerCase();

  }

}
