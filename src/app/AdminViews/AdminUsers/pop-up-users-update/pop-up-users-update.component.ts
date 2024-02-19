import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { map } from 'rxjs';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { MRol } from 'src/app/Models/MRol';
import { MUserCreate } from 'src/app/Models/MUserCreate';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { ListCountryService } from 'src/app/AdminViews/AdminCountries/services/list-country/list-country.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { ApiParameters } from 'src/app/Views/parameters/services/parameters/api.parameters';
import { UsersUpdateService } from 'src/app/AdminViews/AdminRoles/services/usersUpdate/users-update.service';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-pop-up-users-update',
  templateUrl: './pop-up-users-update.component.html',
  styleUrls: ['./pop-up-users-update.component.css']
})
export class PopUpUsersUpdateComponent {

  MListRol: MRol[];
  MUser: MUserCreate;
  MUserEntity: MUserEntity;
  idUser: string = "";
  MUserAuthenticated: any;

  userForm = new FormGroup({
    rol: new FormControl('', [Validators.required])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpUsersUpdateComponent>, 
  private apiUpdateUser: UsersUpdateService, private apiListCountry: ListCountryService, 
  private serviceLists: ObtenerlistaService,private storageData: StorageService) {
    this.MListRol = [];
    this.MUser= {} as MUserCreate;
    this.MUserEntity = {} as MUserEntity;
    this.MUserAuthenticated = this.storageData.obtenerDatosMapeados();
  }


  onSubmit() {

        this.MUser.idUser = this.MUserEntity.idUser;
        this.MUser.nameUser = this.MUserEntity.nameUser; 
        this.MUser.surnameUser = this.MUserEntity.surnameUser;
        this.MUser.email = this.MUserEntity.email;
        this.MUser.employeeCode = this.MUserEntity.employeeCode;
        this.MUser.password = this.MUserEntity.password;
        this.MUser.countryEntityId = this.MUserEntity.countryEntityId;
        this.MUser.roleEntityId = this.userForm.value.rol as unknown as Guid;
        this.MUser.idUserEntiyId=this.MUserAuthenticated!.idUser;

        this.apiUpdateUser.PostUpdateUsers(this.MUser).subscribe(data=> {
          console.log(data);
          if (data.data) {
            Swal.fire({
              icon: 'success',
              title: 'Cambios Guardados Correctamente',
              confirmButtonColor: '#0A6EBD',
            });
            this.serviceLists.listaUsers();
            this.dialogRef.close();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error, los datos no se pudieron cambiar',
              confirmButtonColor: '#0A6EBD',
            });
          }
        }) ;
      
  }


  onClose(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
    this.serviceLists.loadRoles().subscribe((roles) => {
      this.MListRol = roles;
    console.log(this.MListRol);
    console.log(typeof ((this.MListRol[0]).idRole) + " verificacion")
    });
    

    this.MUserEntity = this.data.user;
  }

}
