import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Guid } from 'guid-typescript';
import { Global } from 'src/app/global';
import { MLogin } from 'src/app/Models/MLogin';
import { MUserCreate } from 'src/app/Models/MUserCreate';


@Injectable({
  providedIn: 'root'
})
export class UserConsultByCodeEmService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetUserIdByEmployeCode(employeeCode: string, countryId: string):Observable<MResponse>{
    let direccion = this.URLLocal +"User/GetUserIdByEmployeCode?EmployeeCode=" + employeeCode + "&PaisId=" + countryId;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
  GetUserByEmployeCode(employeeCode: string):Observable<MResponse> {
    let direccion = this.URLLocal +"User/GetByEmployeCode?EmployeeCode=" + employeeCode;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
  GetUserByEmail(emailUser: string):Observable<MResponse>{

    let direccion = this.URLLocal +"User/GetByEmail?EmailUser=" + emailUser;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }

  PostNewUser(NewUsr: MUserCreate):Observable<MResponse>{

    let direccion = this.URLLocal +"User/create";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,NewUsr);
  }
}
