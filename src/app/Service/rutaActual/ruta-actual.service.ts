import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutaActualService {

  rutaActual: string = "";
  private _rutaActuales$ = new Subject<any>();
  private _datosPais$ = new Subject<any>();
  private _globalVar : string = "";


  constructor(private router: Router) {
    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) {
        this.rutaActual = this.router.url;
        console.log(' this.rutaActual: ',  this.rutaActual);
        this._rutaActuales$.next(this.rutaActual);
        console.log(this.rutaActual);
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
