import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, map } from 'rxjs';
import { StorageService } from '../storage-service/storage.service';
import { Guid } from 'guid-typescript';
import { UserConsultByCodeEmService } from 'src/app/Views/user/services/userConsultByCodeEm/user-consult-by-code-em.service';
import { MUserCreate } from 'src/app/Models/MUserCreate';
import { MLogin } from 'src/app/Models/MLogin';

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


  constructor(private router: Router,private storageService: StorageService, private UserCosult:UserConsultByCodeEmService) {
    this.NewUser = {} as MUserCreate;
    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) {

        //catch xml data 
        const urlParams = new URLSearchParams(window.location.search);
        const xmlParam = urlParams.get('uxm_erd');
        

        console.log("parametro obtenido:"+ xmlParam);
        console.log('version 1.0.0.6');
        if(xmlParam!=null){
          console.log("flujo sso");
          //TODO
          //si el contenido emieza con ERROR, redirigir a la pagina d eerro con el mensaje de error
          //si no, continuar...


        //remove from query string uxm_erd
       this.router.navigate([], {
        queryParams: {
          'uxm_erd': null,
        },
        queryParamsHandling: 'merge'
        });
       
       
        //decode param base 64 y obtener los valores
        //var encodedStringAtoB = "eyJlbWFpbCI6Im9tYXJhbHZhcmV6MDFAZ21haWwuY29tIiwibm9tYnJlIjoib21hciIsImxhc3ROYW1lIjoiQWx2YXJleiIsImxvY2F0aW9uIjoiTWV4aWNvIiwidXBuIjoiYXNkc2EiLCJjb21wYW55IjoiT2NpIiwiZGVwYXJ0bWVudCI6IkZpbmFuemFzIiwibmFtZWlkIjoic2RhcyIsInBob25lIjoiYXNkYSJ9";

        // Decode the String
        var decodedStringAtoB = atob(xmlParam);
        console.log("decodificado: " + decodedStringAtoB);
       
        //validar que el usuario (email) exista
        // decodificado: {"email":"omaralvarez01@gmail.com","nombre":"omar","lastName":"Alvarez","location":"Mexico","upn":"asdsa","company":"Oci","department":"Finanzas","nameid":"sdas","phone":"asda"}
        this.objJson = JSON.parse(decodedStringAtoB);
        console.log("ObjetoJason: " + this.objJson.email);
        

        //this.GetUser(this.objJson.email);


        //si no existe, insertarlo via el api
        //si si existe, no hacer nada
     
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
          "rolEntity":{"idRole":this.objJson.roleEntityId,
          "nameRole":this.objJson.nameRole,
          "menuEntity":null}};
        this.storageService.guardarDatosMapeados(datosMapeados)
    
      
        
        
        setTimeout(() => {
          this.rutaActual =  '/dashboard';
          //this.router.url;
          console.log(' this.rutaActual: ',  this.rutaActual);
          this._rutaActuales$.next(this.rutaActual);
          console.log(this.rutaActual);
          //refresh
          this.router.navigate(['dashboard']);
         // location.reload();
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
