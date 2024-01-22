import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';
import { MResponseLoadGuid, MResponseNotificaciones, MSummary } from 'src/app/Models/MSummary';
import { Guid } from 'guid-typescript';


@Injectable({
  providedIn: 'root'
})
export class LoadArpExcelService {

  //url:string ="https://ibm-webapp-01.azurewebsites.net/api/v1/";
  // url:string ="http://localhost:2429/api/v1/";
  private URLLocal = Global.Url;


  constructor(private http:HttpClient)
  { }

  PostLoad1(data:object):Observable<boolean>{
    let direccion = this.URLLocal +"Load/createARP";
    console.log(direccion);
    return this.http.post<boolean>(direccion,data);
  }

  PostLoad2(data:object):Observable<boolean>{
    let direccion = this.URLLocal +"Load/createTSE";
    console.log(direccion);
    return this.http.post<boolean>(direccion,data);
  }

  PostLoad3(data:object):Observable<boolean>{
    let direccion = this.URLLocal +"Load/createSTE";
    console.log(direccion);
    return this.http.post<boolean>(direccion,data);
  }

  PostLoadHorarios(data:object):Observable<boolean>{
    let direccion = this.URLLocal +"Horario/LoadExcel";
    console.log(direccion);
    return this.http.post<boolean>(direccion,data);
  }
  PostLoadHorariosWorkdayG(data:object):Observable<boolean>{
    let direccion = this.URLLocal +"Horario/LoadExcelMan";
    console.log(direccion);
    return this.http.post<boolean>(direccion,data);
  }

  PostLoadFinal(data: object, data2: object, data3: object): Observable<boolean> {
    let direccion = this.URLLocal + "Load/CreateFinal";

    const requestData = {
      data: data,
      data2: data2,
      data3: data3
    };

    console.log(direccion);
    return this.http.post<boolean>(direccion, requestData);
  }

  UploadARP(data: object,datpais:string,idCarga:string): Observable<MResponseLoadGuid> {
    let direccion = this.URLLocal + "Load/UploadARP";
    console.log(direccion);
    const requestData= {
      data:data,
      paisSel: datpais,
      idCarga: idCarga
    };
    return this.http.post<MResponseLoadGuid>(direccion, requestData);
  }

  UploadTSE(data: object,datpais:string,idCarga:string): Observable<MResponseLoadGuid> {
    let direccion = this.URLLocal + "Load/UploadTSE";
    console.log(direccion);
    const requestData= {
      data:data,
      paisSel: datpais,
      idCarga: idCarga
    };
    return this.http.post<MResponseLoadGuid>(direccion, requestData);
  }

  UploadSTE(data: object,datpais:string,idCarga:string): Observable<MSummary> {
    let direccion = this.URLLocal + "Load/UploadSTE";
    const requestData= {
      data:data,
      paisSel: datpais,
      idCarga: idCarga
    };
    console.log(direccion);
    return this.http.post<MSummary>(direccion, requestData);
  }

  
  NotificacionesProceso(idCarga:string): Observable<MResponseNotificaciones> {
    let direccion = this.URLLocal + "Load/Notificaciones";
   
    const requestData= {
     
      idCarga: idCarga
    };

    console.log(direccion);
    return this.http.post<MResponseNotificaciones>(direccion,requestData);
  }

  
}
