import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpUsersCreateComponent } from '../pop-up-users-create/pop-up-users-create.component';
import { PopUpUsersUpdateComponent } from '../pop-up-users-update/pop-up-users-update.component';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { ListUsersService } from 'src/app/AdminViews/AdminRoles/services/listUsers/list-users.service';
import { map } from 'rxjs';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MRol } from 'src/app/Models/MRol';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  Datos = [
    {nombre: 'Juan Romero', email: 'correo@gmail.com ', cargo: 'Aprobador', rol: 'usuario', pais: 'Colombia'}
  ];

columnasAMostrar = ['nombre', 'email', 'rol', 'pais'];

columnas = [
  { nombre: 'nombre', titulo: 'Nombre' },
  { nombre: 'email', titulo: 'Correo Electronico' },
  { nombre: 'rol', titulo: ' Rol' },
  { nombre: 'pais', titulo: 'Pais' },
  
];

MUsers = new MatTableDataSource<any>();
MListRol:  MRol[] = [];
filterValue: string = "";



userForm = new FormGroup({
  rol: new FormControl('')
});


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

ngAfterViewInit() {
  this.MUsers.paginator = this.paginator;
}


constructor(public dialog: MatDialog, private storageService: StorageService, private apiListUsers: ListUsersService, private refresh: ObtenerlistaService, private serviceGlobalFilter: RutaActualService) {
}



applyFilter(event: any) {
   this.filterValue = (event.target as HTMLInputElement).value;
    this.MUsers.filter = this.filterValue.trim().toLowerCase();
  
}




select(value: string){
  this.refresh.consulUserRol(value);
    this.userForm.get('rol')?.setValue(null);

}


  editar(user: MUserEntity) {
    this.dialog.open(PopUpUsersUpdateComponent,{
      data: {
        user: user
      }
    });
  }

  crearUsuario() {
    this.dialog.open(PopUpUsersCreateComponent);
  }



  ngOnInit(): void {
    this.refresh.listaUsers();

    this.refresh.refreshListUser$.subscribe((roles) => {
      this.MUsers.data = roles;
    });
  
    this.refresh.refreshListUsersRol$.subscribe((roles) => {
      this.MUsers.data = roles;
    });
  
    this.refresh.loadRoles().subscribe((roles) => {
      this.MListRol = roles;
      console.log(this.MListRol);
      console.log(typeof ((this.MListRol[0]).idRole) + " verificacion")
    });
  }
}
