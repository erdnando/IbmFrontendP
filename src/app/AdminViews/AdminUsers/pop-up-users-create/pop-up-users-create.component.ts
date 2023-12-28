import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { map } from 'rxjs';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { MRol } from 'src/app/Models/MRol';
import { MUserCreate } from 'src/app/Models/MUserCreate';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { UsersCreateService } from 'src/app/AdminViews/AdminRoles/services/usersCreate/users-create.service';
import Swal from 'sweetalert2';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-pop-up-users-create',
  templateUrl: './pop-up-users-create.component.html',
  styleUrls: ['./pop-up-users-create.component.css']
})
export class PopUpUsersCreateComponent {

  MListCountry: MCountryEntity[];
  MListRol: MRol[];
  MUser: MUserCreate;

  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    rol: new FormControl('', [Validators.required]),
    pais: new FormControl('', [Validators.required])
  });

  constructor(public dialogRef: MatDialogRef<PopUpUsersCreateComponent>, private apiCreateUser: UsersCreateService, private serviceLists: ObtenerlistaService) {
    this.MListRol = [];
    this.MListCountry = [];
    this.MUser = {} as MUserCreate;
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.userForm.value.password === this.userForm.value.confirmPassword) {
        console.log('Las contraseñas coinciden');

        this.MUser.nameUser = this.userForm.value.nombre as unknown as string;
        this.MUser.surnameUser = this.userForm.value.apellidos as unknown as string;
        this.MUser.email = this.userForm.value.correo as unknown as string;
        this.MUser.employeeCode = "1" as unknown as string;
        this.MUser.password = this.userForm.value.password as unknown as string;
        this.MUser.roleEntityId = "796D44B7-2363-4F9B-A087-08DBDE6C7DE5" as unknown as Guid;
        this.MUser.countryEntityId =this.userForm.value.pais  as unknown as Guid;
        
        this.apiCreateUser.PostCreateUser(this.MUser).subscribe(data=> {
          console.log(data);
          if (data.data) {
            Swal.fire({
              icon: 'success',
              title: 'Cambios Guardados Correctamente',
            });
            this.dialogRef.close();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error, los datos no se pudieron cambiar',
            });
          }
        }) ;
      

      } else {
        console.log('Las contraseñas no coinciden');
      }
    } else {
      console.log('Formulario inválido');
    }
  }

  
  

  onClose(): void {
    this.dialogRef.close();
  }


  ngOnInit() {

    this.serviceLists.loadCountries().subscribe((countries) => {
      this.MListCountry = countries;
    console.log(this.MListCountry);
    console.log(typeof ((this.MListCountry[0]).idCounty) + " verificacion")
    });

    this.serviceLists.loadRoles().subscribe((roles) => {
      this.MListRol = roles;
    console.log(this.MListRol);
    console.log(typeof ((this.MListRol[0]).idRole) + " verificacion")
    });

  }

}
