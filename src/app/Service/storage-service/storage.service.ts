import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import { MFestivos } from 'src/app/Models/MFestivos';
import { ParameterConsultService } from '../../Views/parameters/services/parameterConsul/parameter-consult.service';
import { Guid } from 'guid-typescript';

interface MiObjetoApp {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  

  private listaDiasFestivos = new Subject<any>();
  private festivos: any[] = [];
  private festivosAnos: any[] = [];
  products = "";

  private _refresh$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  private _refreshParameters$ = new Subject<any>();

  constructor(private apiParameterConsult: ParameterConsultService) { 
  }

  get refresh$(){
    return this._refresh$.asObservable();
  }

  public guardarDatosMapeados(datos: any): void{
    const datosMapeadosJson = JSON.stringify(datos);
    localStorage.setItem('misDatosMapeados', datosMapeadosJson);
    const datosGuardados = localStorage.getItem('misDatosMapeados');
    if (datosGuardados) {
      this._refresh$.next(true);
    } else {
      this._refresh$.next(false);
    }
  }

  public obtenerDatosMapeados(): any {
    const datosMapeadosJson = localStorage.getItem('misDatosMapeados');
    if (datosMapeadosJson) {
      return JSON.parse(datosMapeadosJson);
    } else {
      return null;
    }
  }

  public eliminarDatosGuardados(): void {
    localStorage.removeItem('misDatosMapeados');
    const datosGuardados = localStorage.getItem('misDatosMapeados');
    if (datosGuardados) {
      this._refresh$.next(true);
    } else {
      this._refresh$.next(false);
    }
  }

  public guardarDiasFestivos(festivo: any):boolean{
    if(this.festivos.findIndex(x => x.diafestivo_DD_MM_YYYY == festivo.diafestivo_DD_MM_YYYY) > -1) return false;
    this.festivos = [...this.festivos, festivo];
    this.listaDiasFestivos.next(this.festivos);
    return true;
  }

  public obtenerDiasFestivos(): Subject<any>{
    return this.listaDiasFestivos
  }

  public obtenerDiasFestivosAnos(): any[]{
    return this.festivos;
  }

  public limpiarDiasFestivos(): void{
    this.listaDiasFestivos = new Subject<any>();
    this.festivos = []
    this.festivosAnos = [];
  }


  public eliminarFestivo(festivo: any): void {
    const index = this.festivos.findIndex(x => x.diafestivo_DD_MM_YYYY == festivo.diafestivo_DD_MM_YYYY);
    if (index > -1) {
      this.festivos.splice(index, 1);
      this.listaDiasFestivos.next(this.festivos);
    }

    for (let i = 0; i < this.festivosAnos.length; i++) {
      if (this.festivosAnos[i].includes(festivo)) {
        this.festivosAnos.splice(i, 1);
        break;
      }
    }
  }

  get refreshParam$(){
    return this._refreshParameters$.asObservable();
  }

  public observableParameters(id: Guid){
    
      this.apiParameterConsult.GetParametersConsult(id).pipe(
        map((data: MiObjetoApp) => data)
      ).subscribe((data) => {
        let listap = data["data"];
        this._refreshParameters$.next(listap)
        console.log(listap);
      });
}

 

}
