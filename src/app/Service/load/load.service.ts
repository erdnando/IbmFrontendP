import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetListInconsistencies(idCarga: string | null, employeeCode: string | null):Observable<MResponse>{
    let direccion = this.URLLocal +"Load/Inconsistencies";
    let idCarg = idCarga?? '';
    let empCode = employeeCode?? '';
    return this.http.get<MResponse>(direccion, {params: {idCarga: idCarg, employeeCode: empCode}});
  }

  GetListLoads(): Observable<MResponse>{
    let direccion = this.URLLocal +"Load/List";
    return this.http.get<MResponse>(direccion);
  }

  GetLoad(id: number | string): Observable<MResponse>{
    let direccion = this.URLLocal +"Load/Consult";
    return this.http.get<MResponse>(direccion, {params: {id}});
  }

  GetArpParameters(idLoad: number | string, params: any): Observable<MResponse>{
    let direccion = this.URLLocal +"Load/ArpParameters/List";
    params.idLoad = idLoad;
    return this.http.get<MResponse>(direccion, {params});
  }

  GetTseParameters(idLoad: number | string, params: any): Observable<MResponse>{
    let direccion = this.URLLocal +"Load/TseParameters/List";
    params.idLoad = idLoad;
    return this.http.get<MResponse>(direccion, {params});
  }

  GetSteParameters(idLoad: number | string, params: any): Observable<MResponse>{
    let direccion = this.URLLocal +"Load/SteParameters/List";
    params.idLoad = idLoad;
    return this.http.get<MResponse>(direccion, {params});
  }
}
