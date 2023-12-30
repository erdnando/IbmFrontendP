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
  tipoIniSes = new FormControl('');
  verpas:boolean=false;

  constructor(private router:Router,private apiLogin:ApiLogin, private storageService: StorageService)
  {
    this.Userlogin = {} as MLogin;
  }

  ngOnInit(){
   //this.tipoIniSes="";
  }

Login(){

  if (this.verpas==false) {
   //call saml sso
   window.location.href = 'https://preprod.login.w3.ibm.com/saml/sps/saml20ip/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=portaltls&NameIdFormat=Email&Target=https://transversal-portaltls-front.shfyjbr2p4o.us-south.codeengine.appdomain.cloud';
   
   return;
  } 
  

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

select(tip: any) {

  if (tip.value ==2) {
    this.verpas = true;
  } else {
    this.verpas = false;
  }
}



}
