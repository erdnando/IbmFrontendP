import { Injectable, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, map } from 'rxjs';
import { StorageService } from '../storage-service/storage.service';
import { Guid } from 'guid-typescript';
import { UserConsultByCodeEmService } from 'src/app/Views/user/services/userConsultByCodeEm/user-consult-by-code-em.service';
import { MUserCreate } from 'src/app/Models/MUserCreate';
import { MLogin } from 'src/app/Models/MLogin';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { ApiLogin } from 'src/app/Views/Login/services/login/api.login';


@Injectable({
  providedIn: 'root'
})



export class RutaActualService {


  
  rutaActual: string = "";
  private _rutaActuales$ = new Subject<any>();
  private _datosPais$ = new Subject<any>();
  private _globalVar : string = "";
  private ExisteUsr: boolean = false;
  private objJson:any;
  NewUser : MUserCreate;
  //MUser: MUserEntity;
  Userlogin : MLogin;

  constructor(private router: Router,private storageService: StorageService, private UserCosult:UserConsultByCodeEmService,
    private apiLogin:ApiLogin ) {

    this.NewUser = {} as MUserCreate;
    //this.MUser = this.storageService.obtenerDatosMapeados();
    this.Userlogin = {} as MLogin;

    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) {

        console.log("=========window.location.hash========");
        console.log(window.location.hash);
        let arrUrlItems = window.location.hash.split('?');
        let uxm_erd="";

        console.log('version 1.0.0.14');

        if(arrUrlItems.length>1){
          console.log("flujo sso");

           uxm_erd=arrUrlItems[1].replace('uxm_erd=','');
           console.log("===========================================");
           console.log(uxm_erd);
   
           //catch xml data 
           
           const xmlParam = uxm_erd;
           console.log("url::::");
           console.log(uxm_erd);
           console.log("parametro obtenido:"+ xmlParam);

           
          
           // Decode the String
           var decodedStringAtoB = atob(xmlParam);
           console.log("decodificado: " + decodedStringAtoB);
         
           //validar que el usuario (email) exista
           this.objJson = JSON.parse(decodedStringAtoB);
           console.log("ObjetoJason: " + this.objJson.email);
           
          // setTimeout(() => {
             this.getAndAddTokenToStorage(this.objJson);
           //}, 500);

        }else{
          console.log("flujo normal");

          this.rutaActual = this.router.url;
          console.log(' this.rutaActual: ',  this.rutaActual);
          this._rutaActuales$.next(this.rutaActual);
          console.log(this.rutaActual);
      }

        
      }
    });
  }

 

  getAndAddTokenToStorage(objJsonx:any){
    console.log(objJsonx);
    this.Userlogin.userName = objJsonx.email;
    this.Userlogin.password = objJsonx.code;

    this.apiLogin.GetLogin(this.Userlogin).pipe(
      map((data: any) => {

        if (data && data.data){
           console.log(data.data);
          //actualizar local storage
        const datosMapeados = {
          "idUser":objJsonx.idUser,
          "email":objJsonx.email,
          "nameUser":objJsonx.nombre,
          "surnameUser":objJsonx.lastName,
          "employeeCode":objJsonx.employeeCode,
          "roleEntityId":objJsonx.roleEntityId,
          "countryEntityId":objJsonx.countryEntityId,
          "countryEntity":{"idCounty":objJsonx.countryEntityId,
          "nameCountry":objJsonx.nameCountry},
          "token": data.data.token,
          "code":data.data.password,
          "rolEntity":{"idRole":objJsonx.roleEntityId,
          "nameRole":objJsonx.nameRole,
          "menuEntity":null,
        }};

        console.log("=================Persisitendo datos usuario login IBM (guardarDatosMapeados)=============");
        this.storageService.guardarDatosMapeados(datosMapeados);
        

        this.rutaActual =  '/dashboard';
        console.log(' this.rutaActual: ',  this.rutaActual);

        
       // setTimeout(() => {
          console.log("redirigiendo al dashboard...")
          this._rutaActuales$.next(this.rutaActual);
          this.router.navigate(['dashboard']);
        //}, 1000);


        if(!localStorage.getItem('foo')){
          localStorage.setItem('foo','no reload');
          location.reload();
        }else{
          localStorage.removeItem('foo');
        }

      }
    })
    ).subscribe(dataMapeada => {

     
      
  });
}

  get pathActual(){
    return this._rutaActuales$.asObservable();
  }

  
    get globalVar() {
      return this._globalVar
    }
  
    public setglobalVar(value: string, idPais: string) {
      this._globalVar = (value);
      let listaPais = [value, idPais];
      this._datosPais$.next(value);
      console.log('id', idPais);
      console.log('value: ', value);
      
    }

    get datosPais(){
      return this._datosPais$.asObservable();
    }

    

}
