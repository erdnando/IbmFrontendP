import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class ReportExceptionService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetListExceptions():Observable<MResponse>{
    let direccion = this.URLLocal +"ReportException/List";
    console.log(direccion);
    return this.http.get<MResponse>(direccion);
  }

  addReportException(report: any) : Observable<MResponse> {
    let direccion = this.URLLocal +"ReportException/Create";
    console.log(direccion);
    return this.http.post<MResponse>(direccion, report);
  }

  cancelReportException(id: string) : Observable<MResponse> {
    let direccion = `${this.URLLocal}ReportException/Delete?id=${id}`;
    console.log(direccion);
    return this.http.delete<MResponse>(direccion);
  }
}
