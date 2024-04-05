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
}
