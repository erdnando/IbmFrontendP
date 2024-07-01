import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import { MFestivos } from 'src/app/Models/MFestivos';
import { ParameterConsultService } from '../../Views/parameters/services/parameterConsul/parameter-consult.service';
import { Guid } from 'guid-typescript';
import { MCreateHorario } from 'src/app/Models/MHorario';

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

  private mHorario1List: MCreateHorario[] = [];//new
  private mHorario2List: MCreateHorario[] = [];//new
  private mHorario3List: MCreateHorario[] = [];//new
  private tabHorarioSelected: any = "0";//new
  private fechaHorarioSelected:Date = new Date();//new
  private usuarioHorario:any = "";//new

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




  //mHorario1...3List
  //-------------------------------------------------------------
  public setHorario1(horarios: MCreateHorario[]):void{
   this.mHorario1List=horarios;
  }
  public getHorarios1(): MCreateHorario[]{
    return this.mHorario1List;
  }
  //-------------------------------------------------------------
  public setHorario2(horarios: MCreateHorario[]):void{
    this.mHorario2List=horarios;
   }
   public getHorarios2(): MCreateHorario[]{
     return this.mHorario2List;
   }

  //-------------------------------------------------------------
   public setHorario3(horarios: MCreateHorario[]):void{
    this.mHorario3List=horarios;
   }
   public getHorarios3(): MCreateHorario[]{
     return this.mHorario3List;
   }

   //-------------------------------------------------------------
   public setTabHorarioSelected(tabIndex: any):void{
    this.tabHorarioSelected=tabIndex;
   }
   public getTabHorarioSelected(): MCreateHorario[]{
     return this.tabHorarioSelected;
   }
   //-------------------------------------------------------------
   public setUsuarioHorario(usuario: any):void{
    this.usuarioHorario=usuario;
   }
   public getUsuarioHorario(): any{
     return this.usuarioHorario;
   }
   //-------------------------------------------------------------
   public setFechaHorarioSelected(fecha: Date):void{
    this.fechaHorarioSelected=fecha;
   }
   public getFechaHorarioSelected(): Date{
     return this.fechaHorarioSelected;
   }
  
   //------------------------------------------------------------





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
