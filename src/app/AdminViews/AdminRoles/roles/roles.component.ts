import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpRolesUpdateComponent } from '../pop-up-roles-update/pop-up-roles-update.component';
import { PopUpRolesCreateComponent } from '../pop-up-roles-create/pop-up-roles-create.component';
import {
  Form,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {  map } from 'rxjs';
import { MRol } from 'src/app/Models/MRol';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { ListUsersService } from 'src/app/AdminViews/AdminRoles/services/listUsers/list-users.service';
import { PopUpUsersUpdateComponent } from '../../AdminUsers/pop-up-users-update/pop-up-users-update.component';

import { MUserEntity } from 'src/app/Models/MUserEntity';

import { PopUpAddExceptionComponent } from '../../usersExceptions/pop-up-add-exception/pop-up-add-exception.component';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';

interface MiObjeto {
  [key: string]: any;
}

interface SideNavTogg1e {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent {
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
  selectedCountry: string;
  MListCountry: MCountryEntity[] = [];


  constructor(
    public dialog: MatDialog,
    private serviceLists: ObtenerlistaService,
    private _formBuilder: FormBuilder,
    private rutaActual: RutaActualService,
    private refresh: ObtenerlistaService,
    private storageService: StorageService,
    private apiListUsers: ListUsersService
  ) {
    this.MRoles = [];
    // this.MMenus = [];
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.selectedCountry = this.rutaActual.globalVar;
    this.MListCountry = [];
  }

  openDialog(id: string, name: string) {
    this.dialog.open(PopUpRolesUpdateComponent, {
      data: {
        // Aquí puedes agregar los datos que quieras enviar
        idRol: id,
        nameRol: name,
      },
    });
  }

  crearRol() {
    this.dialog.open(PopUpRolesCreateComponent);
  }

  RecibirPaisSeleccionado() {
    this.rutaActual.datosPais.subscribe((listap) => {
      console.log(listap)
      this.selectedCountry = listap;
      console.log(this.selectedCountry)
      this.refresh.listaUsers();
    });
  }

  refreshListUsers(){
    this.refresh.refreshListUser$.subscribe((listap) => {
      console.log(listap)
      console.log(this.selectedCountry)

      let ListaFilt = listap.filter((x: any) => x.countryEntity.nameCountry == this.selectedCountry);
      console.log(ListaFilt)
      this.MUsers.data = ListaFilt;
    });
    
  }


  ngOnInit(): void {

    this.RecibirPaisSeleccionado();

    this.serviceLists.loadRoles().subscribe((roles) => {
      this.MRoles = roles;
    });

    this.serviceLists.refreshRoles$.subscribe((lista) => {
      this.MRoles = lista;
    });

    this.serviceLists.refreshCountries$.subscribe((lista) => {
      this.MListCountry = lista;
    });


    this.refresh.refreshListUsersCounty$.subscribe((countries) => {
      console.log(countries)
      this.MUsers.data = countries;
    });

    this.RecibirPaisSeleccionado();
    this.refreshListUsers();

    // this.apiListMenus
    //   .GetMenu()
    //   .pipe(map((data: MiObjeto) => data))
    //   .subscribe((data) => {
    //     let lista = data['data'];
    //     this.MMenus = lista;
    //
    //
    //   });

    // this.refresh.refreshMenus$.subscribe((lista) => {
    //   this.MMenus = lista;
    // });

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


    this.refresh.loadCountries().subscribe((countries) => {
      this.MListCountry = countries;

      const OptionSelectNew = countries;
      OptionSelectNew.push({
        idCounty: 'todoscoun-c9ac-4e43-a40a-000000000000',
        nameCountry: 'Todos'
      });

      this.MListCountry = OptionSelectNew;
    });
    
  }

  //**********************MENUS*************************** */

  // columnasAMostrarMenu = ['nombre'];

  // columnasMenu = [{ nombre: 'nombre', titulo: 'Nombre' }];

  // MMenus: MMenu[];

  // openDialogMenu(id: string, name: string) {
  //   this.dialog.open(PopUpMenusUpdateComponent, {
  //     data: {
  //       // Aquí puedes agregar los datos que quieras enviar
  //       idMenu: id,
  //       nameMenu: name,
  //     },
  //   });
  // }

  // crearMenu() {
  //   this.dialog.open(PopUpMenusCreateComponent);
  // }

  //**************USUARIOS************** */

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
    pais: new FormControl(''),
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
      
    }else{
      this.ngOnInit();
    }
 
  }

  editar(user: MUserEntity) {
    this.dialog.open(PopUpUsersUpdateComponent, {
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

  excepcion(user: MUserEntity) {
    this.dialog.open(PopUpAddExceptionComponent, {
      data: {
        user: user,
      },
    });
  }

  _selectCountryUser(value: string) {
    console.log('value: ', value);
    if(value != 'todoscoun-c9ac-4e43-a40a-000000000000'){
      this.refresh.consulUserCountry(value);
    }else{
      this.ngOnInit();
    }
 
  }


}
