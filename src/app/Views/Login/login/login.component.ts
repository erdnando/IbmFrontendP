import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {Router} from '@angular/router'
import { map } from 'rxjs';
import { MLogin } from 'src/app/Models/MLogin';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { ApiLogin } from 'src/app/Views/Login/services/login/api.login';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})


export class LoginComponent {


  hide = true;
  Userlogin : MLogin;
  password = new FormControl('');
  user = new FormControl('');

  constructor(private router:Router,private apiLogin:ApiLogin, private storageService: StorageService)
  {
    this.Userlogin = {} as MLogin;
  }


Login(){

  
  

  this.Userlogin.userName = this.user.value as string;
  this.Userlogin.password = this.password.value as string;


  this.apiLogin.GetLogin(this.Userlogin).pipe(
    map((data: any) => {

      if (data && data.data) {
        const datosMapeados = {

          idUser: data.data.idUser,
          email: data.data.email,
          nameUser: data.data.nameUser,
          surnameUser: data.data.surnameUser,
          employeeCode: data.data.employeeCode,
          roleEntityId: data.data.roleEntityId,
          countryEntityId: data.data.countryEntityId,
          countryEntity: data.data.countryEntity,
          rolEntity: data.data.roleEntity
        };
        this.storageService.guardarDatosMapeados(datosMapeados)
        return datosMapeados;
      } else {

        return null;
      }
    })
  ).subscribe(dataMapeada => {
    if (dataMapeada) {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
      });
      
      this.router.navigate(['dashboard']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error en el inicio de sesión, correo o contraseña incorrectos.',
      });
    }
  });




}





}
