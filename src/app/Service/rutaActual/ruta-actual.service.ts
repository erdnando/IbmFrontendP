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
import { Buffer } from 'buffer';

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

        console.log('version 1.0.0.15');

        if(arrUrlItems.length>1){
          console.log("flujo sso");

           uxm_erd=arrUrlItems[1].replace('uxm_erd=','');
           console.log("===========================================");
           console.log(uxm_erd);
   
           //catch xml data 
           
           let xmlParam = uxm_erd.replace("%3D","");
           xmlParam = uxm_erd.replace("%3D","");
           xmlParam = uxm_erd.replace("%3D","");
           console.log("url::::");
           console.log(uxm_erd);
           console.log("parametro obtenido:"+ xmlParam);

           
          
           // Decode the String
           var decodedStringAtoB = atob(xmlParam);//atob(xmlParam);//atob
           //var decodedStringAtoB = Buffer.from(xmlParam, 'base64').toString('utf8');

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

  decodeBase64(base64: string) {
    const base64chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  
    if (!base64.match(/^[A-Za-z0-9+/]+={0,2}$/)) {
      throw new Error("Invalid base64 string");
    }
  
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    const bytes = new Uint8Array((base64.length * 6) / 8 - padding);
    let i = 0;
    let j = 0;
  
    while (i < base64.length) {
      const index1 = base64chars.indexOf(base64[i++]);
      const index2 = base64chars.indexOf(base64[i++]);
      const index3 = base64chars.indexOf(base64[i++]);
      const index4 = base64chars.indexOf(base64[i++]);
  
      const decoded1 = (index1 << 2) | (index2 >> 4);
      const decoded2 = ((index2 & 0x0f) << 4) | (index3 >> 2);
      const decoded3 = ((index3 & 0x03) << 6) | index4;
  
      bytes[j++] = decoded1;
  
      if (index3 !== 64) {
        bytes[j++] = decoded2;
      }
      if (index4 !== 64) {
        bytes[j++] = decoded3;
      }
    }
  
    return bytes.buffer;
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
