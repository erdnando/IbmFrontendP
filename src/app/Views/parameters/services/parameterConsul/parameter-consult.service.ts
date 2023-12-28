import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Guid } from 'guid-typescript';
import { Global } from 'src/app/global';



@Injectable({
  providedIn: 'root'
})
export class ParameterConsultService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetParametersConsult(idCountry: Guid):Observable<MResponse>{

    let direccion = this.URLLocal +"Parameters/Consult?IdCountry="+idCountry;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}
