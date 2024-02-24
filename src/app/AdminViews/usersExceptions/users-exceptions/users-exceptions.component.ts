import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MRol } from 'src/app/Models/MRol';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';

import { PopUpAddExceptionComponent } from '../pop-up-add-exception/pop-up-add-exception.component';
import { PopUpUpdateExceptionComponent } from '../pop-up-update-exception/pop-up-update-exception.component';
import { DatePipe } from '@angular/common';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';
import { PopUpUsersUpdateComponent } from '../../AdminUsers/pop-up-users-update/pop-up-users-update.component';
import { ReportExceptionService } from '../service/reportExceptionService/report-exception.service';
import Swal from 'sweetalert2';
import { PopUpAddReportExceptionComponent } from '../pop-up-add-report-exception/pop-up-add-report-exception.component';
import { PopUpAddWorkdayExceptionComponent } from '../pop-up-add-workday-exception/pop-up-add-workday-exception.component';
import { WorkdayExceptionService } from '../service/workdayExceptionService/workday-exception.service';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  providers: [DatePipe],
  selector: 'app-users-exceptions',
  templateUrl: './users-exceptions.component.html',
  styleUrls: ['./users-exceptions.component.css']
})
export class UsersExceptionsComponent {

  datesTable = new MatTableDataSource<any>();
  filterValue: string = "";
  reportsFilterValue: string = "";
  workdaysFilterValue: string = "";
  Approving: boolean = false;
  MUser: MUserEntity;
  //selectedCountry: string;
  MRoles: MRol[];
  MReports = new MatTableDataSource<any>();
  MReportFilters: any[] = [{name: 'report', value: ''}, {name: 'user_code', value: ''}];
  MWorkdays = new MatTableDataSource<any>();
  MWorkdayFilters: any[] = [{name: 'employeeCode', value: ''}, {name: 'countryEntityId', value: ''}];

  @ViewChild('datesTablePaginator') datesTablePaginator!: MatPaginator;
  @ViewChild('musersPaginator') musersPaginator!: MatPaginator;
  @ViewChild('mreportsPaginator') mreportsPaginator!: MatPaginator;
  @ViewChild('mworkdaysPaginator') mworkdaysPaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.datesTable.paginator = this.datesTablePaginator;
    this.MUsers.paginator = this.musersPaginator;
    this.MReports.paginator = this.mreportsPaginator;
    this.MWorkdays.paginator = this.mworkdaysPaginator;
  }

  columnasAMostrarUser = ['nombre', 'codigo', 'fecha', 'horaInicio'];

  columnasAMostrarUserExceptuado = ['nombre', 'email', 'rol', 'pais'];
  columnasAMostrarReporteExceptuado = ['report', 'user_code', 'date', 'exception_date'];
  columnasAMostrarWorkdayExceptuado = ['employee_code', 'employee_name', 'original_date', 'original_start_time', 'original_end_time', 'real_date', 'real_start_time', 'real_end_time', 'report_type', 'justification', 'approving_manager'];
  columnasUserExceptuado = [
    { nombre: 'nombre', titulo: 'Nombre' },
    { nombre: 'email', titulo: 'Correo Electronico' },
    { nombre: 'rol', titulo: ' Rol' },
    { nombre: 'pais', titulo: 'Pais' },
  ];

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private refresh: ObtenerlistaService,
    private rutaActual: RutaActualService,
    private serviceLists: ObtenerlistaService,
    private reportExceptionService: ReportExceptionService,
    private workdayExceptionService: WorkdayExceptionService,
  ) {
    this.MRoles = [];
    this.MListCountry = [];
    this.MUser = this.storageService.obtenerDatosMapeados();
    //this.selectedCountry = this.rutaActual.globalVar;
  }



  applyFilter(event: any) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.datesTable.filterPredicate = (data: any, filter: string) => {

      const nombreCoincide = data.user.nameUser.toLowerCase().includes(filter);
      const codigoEmpleadoCoincide = data.user.employeeCode.toLowerCase().includes(filter);
      const apellidoCoincide = data.user.surnameUser.toLowerCase().includes(filter);
      return nombreCoincide || codigoEmpleadoCoincide  || apellidoCoincide;
    };
    this.datesTable.filter = this.filterValue.trim().toLowerCase();

  }

  validateRole() {
    if (
      this.MUser.rolEntity.nameRole == 'Administrador' ||
      this.MUser.rolEntity.nameRole == 'Super Administrador' ||
      this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2' ||
      this.MUser.rolEntity.nameRole == 'Usuario Aprobador N1' 
    ) {
      this.Approving = true;
    }
  }

  editar(object: any) {
    this.dialog.open(PopUpUpdateExceptionComponent, {
      data: {
        user: object,
      },
    });

  }


  ngOnInit() {

    this.validateRole();

    this.refresh.loadListUsersExceptions();
    this.refresh.loadListReportExceptions();
    this.refresh.loadListWorkdayExceptions();

    this.refresh.refreshUserException$.subscribe((exceptions) => {
      console.log(exceptions)
      this.datesTable.data = exceptions;
    });

    this.MReports.filterPredicate = (data, filter) => {
      let result = false;
      for (let reportFilter of this.MReportFilters) {
        if (reportFilter.value == '') continue;
        if (reportFilter.name == 'user_code') {
          if (data.userEntity.employeeCode.includes(filter)) { result = true; break; }
        } else {
          if (data[reportFilter.name].includes(filter)) { result = true; break; }
        }
      }
      return result;
    };
    this.refresh.refreshReportException$.subscribe((exceptions) => {
      this.MReports.data = exceptions;
    });

    this.MWorkdays.filterPredicate = (data, filter) => {
      let result = false;
      for (let workdayFilter of this.MWorkdayFilters) {
        if (workdayFilter.value == '') continue;
        if (data[workdayFilter.name].includes(filter)) { result = true; break; }
      }
      return result;
    };
    this.refresh.refreshWorkdayException$.subscribe((exceptions) => {
      this.MWorkdays.data = exceptions;
    });

    //----------------new---------------------------
    this._RecibirPaisSeleccionado();

    this.serviceLists.loadRoles().subscribe((roles) => {
      this.MRoles = roles;
    });

    this.serviceLists.refreshRoles$.subscribe((lista) => {
      this.MRoles = lista;
    });

    this.serviceLists.refreshCountries$.subscribe((lista) => {
      this.MListCountry = lista;
    });

    this._RecibirPaisSeleccionado();
    this._refreshListUsers();


    this.refresh.listaUsers();

    this.refresh.refreshListUsersRol$.subscribe((roles) => {
      console.log(roles)
      this.MUsers.data = roles;
    });

    this.refresh.refreshListUsersCounty$.subscribe((countries) => {
      console.log(countries)
      this.MUsers.data = countries;
    });

    this.refresh.refreshListUsersExceptionsCounty$.subscribe((countries) => {
      console.log(countries)
      this.datesTable.data = countries;
    });

    this.refresh.loadRoles().subscribe((roles) => {
      this.MListRol = roles;

      const OptionSelect = roles;
      OptionSelect.push({
        idRole: 'todosrolb-c9ac-4e43-a40a-000000000000',
        nameRole: 'Todos',
        menuEntity: null,
      });

      this.MListRol = OptionSelect;
    });

    this.refresh.loadCountries().subscribe((countries) => {
      this.MListCountry = countries;

      const OptionSelectNew = countries;
      OptionSelectNew.push({
        idCounty: 'todoscoun-c9ac-4e43-a40a-000000000000',
        nameCountry: 'Todos'
      });

      this.MListCountry = OptionSelectNew;
    });

    this.validateRole();

  }

  addReportException() {
    let dialogRef = this.dialog.open(PopUpAddReportExceptionComponent);

    dialogRef.afterClosed().subscribe(result => {
      this._refreshListReportExceptions();
    });
  }

  addWorkdayException() {
    let dialogRef = this.dialog.open(PopUpAddWorkdayExceptionComponent);

    dialogRef.afterClosed().subscribe(result => {
      this._refreshListWorkdayExceptions();
    });
  }

  cancelReportExcepcion(report: any) {
    console.log('report', report);
    this.reportExceptionService.cancelReportException(report.idReportException).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Excepción Cancelada Correctamente',
        confirmButtonColor: '#0A6EBD',
      });

      this._refreshListReportExceptions();
    });
  }

  activateWorkdayException(exception: any) {
    console.log('exception', exception);
    this.workdayExceptionService.activateWorkdayException(exception.idWorkdayException).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Excepción Activada Correctamente',
        confirmButtonColor: '#0A6EBD',
      });

      this._refreshListWorkdayExceptions();
    });
  }

  deactivateWorkdayException(exception: any) {
    console.log('exception', exception);
    this.workdayExceptionService.deactivateWorkdayException(exception.idWorkdayException).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Excepción Desactivada Correctamente',
        confirmButtonColor: '#0A6EBD',
      });

      this._refreshListWorkdayExceptions();
    });
  }

  //----------------------------------------
  MUsers = new MatTableDataSource<any>();
  MListRol: MRol[] = [];
  MListCountry: MCountryEntity[] = [];
  userForm = new FormGroup({
    rol: new FormControl(''),
  });
  hideColumn=false;

  _excepcion(user: MUserEntity) {
    let dialogRef = this.dialog.open(PopUpAddExceptionComponent, {
      data: {
        user: user,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.refresh.loadListUsersExceptions();

      this.refresh.refreshUserException$.subscribe((exceptions) => {
        console.log(exceptions)
        this.datesTable.data = exceptions;
      });
      
    });

  }

  _select(value: string) {
    console.log('value: ', value);
    if(value != 'todosrolb-c9ac-4e43-a40a-000000000000'){
      this.refresh.consulUserRol(value);
      
    }else{
      this.ngOnInit();
    }
 
  }

  _selectCountryUser(value: string) {
    console.log('value: ', value);
    if(value != 'todoscoun-c9ac-4e43-a40a-000000000000'){
      this.refresh.consulUserCountry(value);
    }else{
      this.ngOnInit();
    }
 
  }

  _selectCountryUsersExceptions(value: string) {
    console.log('value: ', value);
    if(value != 'todoscoun-c9ac-4e43-a40a-000000000000'){
      this.refresh.consulUsersExceptionsCountry(value);
    }else{
      this.ngOnInit();
    }
 
  }

  _applyFilter(event: any) {   
    this.filterValue = (event.target as HTMLInputElement).value;
    this.MUsers.filter = this.filterValue.trim().toLowerCase();
  }

  _applyReportExceptionsFilter(columnName: string, event: any) {
    this.reportsFilterValue = (event.target as HTMLInputElement).value;
    this.MReportFilters.find(x => x.name == columnName).value = this.reportsFilterValue;
    this.MReports.filter = this.reportsFilterValue;
  }

  _applyWorkdayExceptionsFilter(columnName: string, event: any) {
    this.workdaysFilterValue = (event.target as HTMLInputElement).value;
    this.MWorkdayFilters.find(x => x.name == columnName).value = this.workdaysFilterValue;
    this.MWorkdays.filter = this.workdaysFilterValue;
  }

  _refreshListUsers(){
    this.refresh.refreshListUser$.subscribe((listap) => {
      console.log(listap)
      this.MUsers.data = listap;
    });
  }

  _refreshListReportExceptions(){
    this.refresh.loadListReportExceptions();
  }

  _refreshListWorkdayExceptions(){
    this.refresh.loadListWorkdayExceptions();
  }

  _RecibirPaisSeleccionado() {
    /*
    this.rutaActual.datosPais.subscribe((listap) => {
      console.log(listap)
      this.selectedCountry = listap;
      console.log(this.selectedCountry)
      this.refresh.listaUsers();
    });
    */
  }

  /*_editar(user: MUserEntity) {
    this.dialog.open(PopUpUsersUpdateComponent, {
      data: {
        user: user,
      },
    });
  }*/

  

  /*

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  Datos = [{ nombre: 'Usuario' }];

  columnasAMostrar = ['nombre'];

  columnas = [{ nombre: 'nombre', titulo: 'Nombre' }];

  MRoles: MRol[];
  MUser: MUserEntity;
  Approving: boolean = false;

  constructor(
    public dialog: MatDialog,
    private serviceLists: ObtenerlistaService,
    private _formBuilder: FormBuilder,
    private refresh: ObtenerlistaService,
    private storageService: StorageService,
  ) {
    this.MRoles = [];
    // this.MMenus = [];
    this.MUser = this.storageService.obtenerDatosMapeados();
  }

  columnasAMostrarUser = ['nombre', 'email', 'rol', 'pais'];

  columnasUser = [
    { nombre: 'nombre', titulo: 'Nombre' },
    { nombre: 'email', titulo: 'Correo Electronico' },
    { nombre: 'rol', titulo: ' Rol' },
    { nombre: 'pais', titulo: 'Pais' },
  ];

  MUsers = new MatTableDataSource<any>();
  MListRol: MRol[] = [];
  filterValue: string = '';

  userForm = new FormGroup({
    rol: new FormControl(''),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.MUsers.paginator = this.paginator;
  }

  applyFilter(event: any) {   
    this.filterValue = (event.target as HTMLInputElement).value;
    this.MUsers.filter = this.filterValue.trim().toLowerCase();
  }
  

  select(value: string) {
    console.log('value: ', value);
    if(value != 'todosrolb-c9ac-4e43-a40a-000000000000'){
      this.refresh.consulUserRol(value);
      this.userForm.get('rol')?.setValue('');
    }else{
      this.ngOnInit();
    }
 
  }

  excepcion(user: MUserEntity) {
    this.dialog.open(PopUpAddExceptionComponent, {
      data: {
        user: user,
      },
    });
  }

  validateRole() {
    if (
      this.MUser.rolEntity.nameRole == 'Administrador' ||
      this.MUser.rolEntity.nameRole == 'Super Administrador'
    ) {
      this.Approving = true;
    }
  }

  ngOnInit(): void {
    this.serviceLists.loadRoles().subscribe((roles) => {
      this.MRoles = roles;
    });

    this.serviceLists.refreshRoles$.subscribe((lista) => {
      this.MRoles = lista;
    });

    this.refresh.listaUsers();

    this.refresh.refreshListUser$.subscribe((roles) => {
      this.MUsers.data = roles;
    });

    this.refresh.refreshListUsersRol$.subscribe((roles) => {
      this.MUsers.data = roles;
    });

    this.refresh.loadRoles().subscribe((roles) => {
      this.MListRol = roles;

      const OptionSelect = roles;
      OptionSelect.push({
        idRole: 'todosrolb-c9ac-4e43-a40a-000000000000',
        nameRole: 'Todos',
        menuEntity: null,
      });

      this.MListRol = OptionSelect;
    });

    this.validateRole();
  }*/

}
