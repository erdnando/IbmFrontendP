import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class ListExceptionService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetListExceptions():Observable<MResponse>{

    let direccion = this.URLLocal +"UsersException/List";
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}
