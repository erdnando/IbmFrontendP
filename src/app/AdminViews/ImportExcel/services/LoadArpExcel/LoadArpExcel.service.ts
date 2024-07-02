import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';
import { MResponseLoadGuid, MResponseNotificaciones, MResponseOverlapingPortalDB, MSummary, MSummaryFinal } from 'src/app/Models/MSummary';
import { Guid } from 'guid-typescript';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadArpExcelService {

  //url:string ="https://ibm-webapp-01.azurewebsites.net/api/v1/";
  // url:string ="http://localhost:2429/api/v1/";
  private URLLocal = Global.Url;
  private timeoutx = 1000 * 3600;//1 hora

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
  PostLoadHorariosWorkdayG(data:object):Observable<any>{
    let direccion = this.URLLocal +"Horario/LoadExcelMan"; 
    console.log(direccion);
    return this.http.post(direccion,data);
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

  
  GetCarga(): Observable<MResponseLoadGuid> {
    let direccion = this.URLLocal + "Load/GeneraCarga";
    console.log(direccion);
    
    return this.http.get<MResponseLoadGuid>(direccion);
  }

  CancelarCarga(idCarga:string): Observable<MResponseLoadGuid> {
    let direccion = this.URLLocal + "Load/CancelarCarga?idCarga=" + idCarga;
    console.log(direccion);
    
    return this.http.get<MResponseLoadGuid>(direccion);
  }

  GetCargaAvance(idCarga:string) : Observable<any> {
    let direccion = this.URLLocal + "Load/CargaAvance?idCarga=" + idCarga;
    console.log(direccion);
    
    return this.http.get<MResponseLoadGuid>(direccion);
  }

  UploadARP(data: object,datpais:string,idCarga:string,idUserEntiyId:string): Observable<MResponseLoadGuid> {
    let direccion = this.URLLocal + "Load/UploadARP";
    console.log(direccion);
    const requestData= {
      data:data,
      paisSel: datpais,
      idCarga: idCarga,
      idUserEntiyId:idUserEntiyId
    };
    return this.http.post<MResponseLoadGuid>(direccion, requestData);
  }

  UploadTSE(data: object,datpais:string,idCarga:string,idUserEntiyId:string): Observable<MResponseLoadGuid> {
    let direccion = this.URLLocal + "Load/UploadTSE";
    console.log(direccion);
    const requestData= {
      data:data,
      paisSel: datpais,
      idCarga: idCarga,
      idUserEntiyId:idUserEntiyId
    };
    return this.http.post<MResponseLoadGuid>(direccion, requestData);
  }

  UploadSTE(data: object,datpais:string,idCarga:string,idUserEntiyId:string): Observable<MSummary> {
    let direccion = this.URLLocal + "Load/UploadSTE";
    const requestData= {
      data:data,
      paisSel: datpais,
      idCarga: idCarga,
      idUserEntiyId:idUserEntiyId
    };
    console.log(direccion);
    return this.http.post<MSummary>(direccion, requestData);
  }

  
  NotificacionesProceso(idCarga:string,idUserEntiyId:string): Observable<MResponseNotificaciones> {
    let direccion = this.URLLocal + "Load/Notificaciones";
   
    const requestData= {
      idCarga: idCarga,
      idUserEntiyId:idUserEntiyId
    };

    console.log(direccion);
    return this.http.post<MResponseNotificaciones>(direccion,requestData);
  }

  ValidaLimitesExcepcionesOverlapping(idCarga:string,idUserEntiyId:string): Observable<MSummaryFinal> {
    let direccion = this.URLLocal + "Load/ValidaLimitesExcepcionesOverlapping";
   
    const requestData= {
      idCarga: idCarga,
      idUserEntiyId:idUserEntiyId
    };

    console.log(direccion);
    return this.http.post<MSummaryFinal>(direccion,requestData);
  }

  UploadUserGMT(data: object): Observable<MResponseLoadGuid> {
    let direccion = this.URLLocal + "Load/UploadUserGMT";
    console.log(direccion);
    const requestData= {
      data:data,
    };
    return this.http.post<MResponseLoadGuid>(direccion, requestData);
  }

  getNotificationsFile(idCarga: string): Observable<any> {
    let direccion = this.URLLocal +"Load/NotificationsFile?idCarga="+idCarga; 
    console.log(direccion);
    
    return this.http.get(direccion, { observe: 'response', responseType: 'blob' });
  }
  
}
