import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';




@Injectable({
  providedIn: 'root'
})
export class ApproverListService {
  private URLLocal = Global.Url;

  // url:string ="https://ibm-webapp-01.azurewebsites.net/api/v1/";
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetApprover():Observable<MResponse>{

    let direccion = this.URLLocal +"Aprobador/ListConsult";
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}
