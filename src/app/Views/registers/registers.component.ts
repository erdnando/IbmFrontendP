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
      return nombreCoincide || codigoEmpleadoCoincide || emailCoincide || apellidoCoincide;
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
    if (this.MUser.rolEntity.nameRole == 'Administrador'||this.MUser.rolEntity.nameRole =='Super Administrador' || this.MUser.rolEntity.nameRole =='Usuario Aprobador N2') {
      this.Approving = true;
    }
  }

  ConsultarDatasource(){
    this.apiHistory
    .GetRegistersHoursReport()
    .pipe(map((data: MiObjetoApp) => data))
    .subscribe((data) => {
      console.log(this.rutaActual.MUser, this.rutaActual.NewUser);
      let listap = data['data'];
      this.mListHorusReportList = listap;
      let ListaFilt = listap;
      if (this.MUser.rolEntity.nameRole != 'Super Administrador') {
        ListaFilt = listap.filter((x: any) => x.userEntity.countryEntity.nameCountry == this.selectedCountry);
      }

      if (this.MUser.rolEntity.nameRole != 'Administrador' && this.MUser.rolEntity.nameRole != 'Super Administrador') {
        ListaFilt = ListaFilt.filter((x: any) => {x.userEntityId == this.MUser.idUser});
      }


      this.mListHorusReport.data = ListaFilt;
     // this.ngOnInit(); //no debe ir
    });
  }

  RecibirPaisSeleccionado() {
    this.selectedCountry = this.rutaActual.globalVar;
  }

}