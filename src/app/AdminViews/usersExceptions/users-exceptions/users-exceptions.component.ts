import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MRol } from 'src/app/Models/MRol';
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
  Approving: boolean = false;
  MUser: MUserEntity;
  selectedCountry: string;
  MRoles: MRol[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.datesTable.paginator = this.paginator;
    this.MUsers.paginator = this.paginator;
  }

  columnasAMostrarUser = ['nombre', 'codigo', 'fecha', 'horaInicio'];

  columnasAMostrarUserExceptuado = ['nombre', 'email', 'rol', 'pais'];
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
  ) {
    this.MRoles = [];
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.selectedCountry = this.rutaActual.globalVar;
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
      this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2' 
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

    this.refresh.refreshUserException$.subscribe((exceptions) => {
      console.log(exceptions)
      this.datesTable.data = exceptions;
    });

    //----------------new---------------------------
    this._RecibirPaisSeleccionado();

    this.serviceLists.loadRoles().subscribe((roles) => {
      this.MRoles = roles;
    });

    this.serviceLists.refreshRoles$.subscribe((lista) => {
      this.MRoles = lista;
    });

    this._RecibirPaisSeleccionado();
    this._refreshListUsers();


    this.refresh.listaUsers();

    this.refresh.refreshListUsersRol$.subscribe((roles) => {
      let ListaFilt = roles.filter((x: any) => x.countryEntity.nameCountry == this.selectedCountry);
      console.log(ListaFilt)
      this.MUsers.data = ListaFilt;
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

  }

  //----------------------------------------
  MUsers = new MatTableDataSource<any>();
  MListRol: MRol[] = [];
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


  _applyFilter(event: any) {   
    this.filterValue = (event.target as HTMLInputElement).value;
    this.MUsers.filter = this.filterValue.trim().toLowerCase();
  }

  _refreshListUsers(){
    this.refresh.refreshListUser$.subscribe((listap) => {
      console.log(listap)
      console.log(this.selectedCountry)

      let ListaFilt = listap.filter((x: any) => x.countryEntity.nameCountry == this.selectedCountry);
      console.log(ListaFilt)
      this.MUsers.data = ListaFilt;
    });
  }

  _RecibirPaisSeleccionado() {
    this.rutaActual.datosPais.subscribe((listap) => {
      console.log(listap)
      this.selectedCountry = listap;
      console.log(this.selectedCountry)
      this.refresh.listaUsers();
    });
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
