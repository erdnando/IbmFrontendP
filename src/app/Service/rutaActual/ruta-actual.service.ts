import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { StorageService } from '../storage-service/storage.service';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class RutaActualService {

  rutaActual: string = "";
  private _rutaActuales$ = new Subject<any>();
  private _datosPais$ = new Subject<any>();
  private _globalVar : string = "";


  constructor(private router: Router,private storageService: StorageService) {
    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) {

        //catch xml data 
        const urlParams = new URLSearchParams(window.location.search);
        const xmlParam = urlParams.get('uxm_erd');
        console.log("parametro obtenido:"+ xmlParam);
        console.log('version 1.0.0.5');
        if(xmlParam!=null){
          console.log("flujo sso");
          


        //remove from query string uxm_erd
       this.router.navigate([], {
        queryParams: {
          'uxm_erd': null,
        },
        queryParamsHandling: 'merge'
        });
       
       
        //decode param base 64 y obtener los valores
        
        //validar que el usuario (email) exista
        //si no existe, insertarlo via el api
        //si si existe, no hacer nada
     
        //actualizar local storage
        const datosMapeados = {
          "idUser":"3696718d-d05a-4831-96ce-ed500c5bbc97",
          "email":"felipe@gmail.com",
          "nameUser":"Felipe",
          "surnameUser":"Rodriguez",
          "employeeCode":"1",
          "roleEntityId":"a8781b60-0bda-4e9d-a8c1-114bebd1877e",
          "countryEntityId":"908465f1-4848-4c86-9e30-471982c01a2d",
          "countryEntity":{"idCounty":"908465f1-4848-4c86-9e30-471982c01a2d",
          "nameCountry":"Colombia"},
          "rolEntity":{"idRole":"a8781b60-0bda-4e9d-a8c1-114bebd1877e",
          "nameRole":"Super Administrador",
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
