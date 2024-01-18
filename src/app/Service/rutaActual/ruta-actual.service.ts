import { Injectable } from '@angular/core';
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
  MUser: MUserEntity;
  Userlogin : MLogin;

  constructor(private router: Router,private storageService: StorageService, private UserCosult:UserConsultByCodeEmService,private apiLogin:ApiLogin) {
    this.NewUser = {} as MUserCreate;
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.Userlogin = {} as MLogin;

    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) {

        //catch xml data 
        const urlParams = new URLSearchParams(window.location.search);
        const xmlParam = urlParams.get('uxm_erd');
        

        console.log("parametro obtenido:"+ xmlParam);
        console.log('version 1.0.0.8');
        if(xmlParam!=null){
          console.log("flujo sso");
          //TODO
          //si el contenido emieza con ERROR, redirigir a la pagina de error con el mensaje de error
          //si no, continuar...


        //remove from query string uxm_erd
       this.router.navigate([], {
        queryParams: {
          'uxm_erd': null,
        },
        queryParamsHandling: 'merge'
        });
       
  
        // Decode the String
        var decodedStringAtoB = atob(xmlParam);
        console.log("decodificado: " + decodedStringAtoB);
       
        //validar que el usuario (email) exista
        this.objJson = JSON.parse(decodedStringAtoB);
        console.log("ObjetoJason: " + this.objJson.email);
        
       
          
        
        
        setTimeout(() => {
          this.getAndAddTokenToStorage(this.objJson);
         /* this.rutaActual =  '/dashboard';
          //this.router.url;
          console.log(' this.rutaActual: ',  this.rutaActual);
          this._rutaActuales$.next(this.rutaActual);
          console.log(this.rutaActual);
          //refresh
          this.router.navigate(['dashboard']);*/
         }, 500);
        

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

  getAndAddTokenToStorage(json:any){
    console.log(json);
    this.Userlogin.userName = json.email;
    this.Userlogin.password = json.code;

    this.apiLogin.GetLogin(this.Userlogin).pipe(
      map((data: any) => {

        if (data && data.data){
           console.log(data.data);
          //actualizar local storage
        const datosMapeados = {
          "idUser":this.objJson.idUser,
          "email":this.objJson.email,
          "nameUser":this.objJson.nombre,
          "surnameUser":this.objJson.lastName,
          "employeeCode":this.objJson.employeeCode,
          "roleEntityId":this.objJson.roleEntityId,
          "countryEntityId":this.objJson.countryEntityId,
          "countryEntity":{"idCounty":this.objJson.countryEntityId,
          "nameCountry":this.objJson.nameCountry},
          "token": data.data.token,
          "code":data.data.password,
          "rolEntity":{"idRole":this.objJson.roleEntityId,
          "nameRole":this.objJson.nameRole,
          "menuEntity":null,
        }};

        this.storageService.guardarDatosMapeados(datosMapeados);

        this.rutaActual =  '/dashboard';
        //this.router.url;
        console.log(' this.rutaActual: ',  this.rutaActual);
        this._rutaActuales$.next(this.rutaActual);
        console.log(this.rutaActual);
        //refresh
        this.router.navigate(['dashboard']);
       // location.reload();


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
