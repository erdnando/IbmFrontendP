import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import {MUserEntity} from 'src/app/Models/MUserEntity'
import { MUserManagerEntity } from "src/app/Models/MUserManagerEntity";
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class ApiUser {

  private URLLocal = Global.Url;

  constructor(private http:HttpClient)
  { }

  GetUser(muser:MUserEntity):Observable<MUserEntity>{
    // let header = new HttpHeaders().set("Authorization","Bearer "+ localStorage.getItem("Tok") as string);
    // console.log(header);
    let direccion = this.URLLocal + "User/create" ;
    console.log(direccion);
    return this.http.post<MUserEntity>(direccion,muser);
  }

  GetGerente(muser:string):Observable<any>{
    let direccion = this.URLLocal + "User/GetManagerByEmployeeCode?employeeCode=" + muser ;
    console.log(direccion);
    return this.http.get<any>(direccion);
  }
  GetAprovved(Nive:Number):Observable<MResponse>{

      let direccion = this.URLLocal + "User/Aproved?nivel="+Nive;
      console.log(direccion);
      return this.http.get<MResponse>(direccion);

  }



}

