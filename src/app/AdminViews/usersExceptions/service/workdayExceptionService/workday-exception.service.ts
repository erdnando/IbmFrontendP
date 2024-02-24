import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class WorkdayExceptionService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetListExceptions():Observable<MResponse>{
    let direccion = this.URLLocal +"WorkdayException/List";
    console.log(direccion);
    return this.http.get<MResponse>(direccion);
  }

  addWorkdayException(report: any) : Observable<MResponse> {
    let direccion = this.URLLocal +"WorkdayException/Create";
    console.log(direccion);
    return this.http.post<MResponse>(direccion, report);
  }

  activateWorkdayException(id: string) : Observable<MResponse> {
    let direccion = `${this.URLLocal}WorkdayException/Activate?id=${id}`;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);
  }

  deactivateWorkdayException(id: string) : Observable<MResponse> {
    let direccion = `${this.URLLocal}WorkdayException/Deactivate?id=${id}`;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);
  }
}
