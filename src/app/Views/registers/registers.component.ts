import { Component, ViewChild } from '@angular/core';
import { PopupHistoryComponent } from '../popup-history/popup-history.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { map } from 'rxjs';
import { MListHorusReport } from 'src/app/Models/MListHorusReport';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RegistersHoursReportService } from 'src/app/Views/registers/services/registersHoursreport/registers-hours-report.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';


interface MiObjetoApp {
  [key: string]: any;
}

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.css'],
})
export class RegistersComponent {
  columnasAMostrar = [
   'fechaReporte',
    'nombre',
    'empleado',
    'correo',
    'pais',
    'reporte',
    'horas',
  ];

  userForm = new FormGroup({
    rol: new FormControl(''),
  });

  mListHorusReport = new MatTableDataSource<any>();
  mListHorusReportList: MListHorusReport[] = [];
  MUser: MUserEntity;
  filterValue: string = '';
  isLoading:boolean=false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedCountry: string = '';
  router: any;
  Approving:boolean = false;

  ngAfterViewInit() {
    this.mListHorusReport.paginator = this.paginator;
  }

  constructor(
    private storageService: StorageService,
    public dialog: MatDialog,
    private apiHistory: RegistersHoursReportService,
    private rutaActual: RutaActualService,
  ) {
    this.MUser = this.storageService.obtenerDatosMapeados();
  }

  applyFilter(event: any) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.mListHorusReport.filterPredicate = (data: any, filter: string) => {

      const nombreCoincide = data.userEntity.nameUser.toLowerCase().includes(filter);
      const codigoEmpleadoCoincide = data.userEntity.employeeCode.toLowerCase().includes(filter);
      const emailCoincide = data.userEntity.email.toLowerCase().includes(filter);
      const apellidoCoincide = data.userEntity.surnameUser.toLowerCase().includes(filter);

      const paisCoincide = data.userEntity.countryEntity.nameCountry.toLowerCase().includes(filter);
      const reporteCoincide = data.numberReport.toString().includes(filter);

      const hrsReportadasCoincide = data.countHours.toString().includes(filter);
      
      //console.log("data")
     // console.log(data)
      //let arrFecha = data.strCreationDate.substring(0,10).split('-');
      //let fechaReconvertida = arrFecha[2] +"/"+ arrFecha[1] +"/"+ arrFecha[0];
      //const creationDateCoincide = fechaReconvertida.toString().includes(filter);

      const creationDateCoincide = data.strCreationDate.substring(0,10).includes(filter);

      

      return nombreCoincide || codigoEmpleadoCoincide || emailCoincide || apellidoCoincide || paisCoincide || reporteCoincide || creationDateCoincide || hrsReportadasCoincide;
    };
    this.mListHorusReport.filter = this.filterValue.trim().toLowerCase();

  }

  openDialog(id: Guid) {
    let lista = this.mListHorusReportList;
    let objeto = lista.find((lista) => lista.idHorusReport === id);

    this.dialog.open(PopupHistoryComponent, {
      data: {
        reporte: id,
        procede: 'registers',
      },
    });
  }

  ngOnInit() {
    this.RecibirPaisSeleccionado();
    this.ConsultarDatasource();
    this.validateRole();
  }

  validateRole(){
    if (this.MUser.rolEntity.nameRole == 'Administrador'||this.MUser.rolEntity.nameRole =='Super Administrador' || 
     this.MUser.rolEntity.nameRole =='Usuario Aprobador N2' || this.MUser.rolEntity.nameRole =='Usuario Aprobador N1') {
      this.Approving = true;
    }
  } 

  ConsultarDatasource(){
    this.isLoading=true;
    this.apiHistory
    .GetRegistersHoursReport()
    .pipe(map((data: MiObjetoApp) => data))
    .subscribe((data) => {

      console.log("data api list")
      console.log(data)
      let listap = data['data'];
      this.mListHorusReportList = listap;
      let ListaFilt = listap;
      
   

      if (this.MUser.rolEntity.nameRole == 'Super Administrador' || this.MUser.rolEntity.nameRole == 'Administrador' ||
          this.MUser.rolEntity.nameRole == 'Usuario Aprobador N1' || this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2') {
          
            ListaFilt = listap.filter((x: any) => x.userEntity.countryEntity.nameCountry == this.selectedCountry);

      }else if (this.MUser.rolEntity.nameRole == 'Usuario estandar') {
        ListaFilt = ListaFilt.filter((x: any) => {x.userEntityId == this.MUser.idUser});
      }


      this.mListHorusReport.data = ListaFilt;
      this.isLoading=false;
    });
  }

  RecibirPaisSeleccionado() {
    this.selectedCountry = this.rutaActual.globalVar;
  }

  formatFecha(stringFecha: string){
    let arrFecha = stringFecha.split('-')
    return arrFecha[2] +"/"+ arrFecha[1] +"/"+ arrFecha[0];
  }

}