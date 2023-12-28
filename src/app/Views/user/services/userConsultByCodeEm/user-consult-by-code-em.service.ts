import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Guid } from 'guid-typescript';
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class UserConsultByCodeEmService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetUserEmployeCode(idUser: string, countryId: string):Observable<MResponse>{

    let direccion = this.URLLocal +"User/GetByEmployeCode?EmployeeCode=" + idUser + "&PaisId=" + countryId;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}
