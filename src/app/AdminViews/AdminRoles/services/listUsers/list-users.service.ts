import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class ListUsersService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetUsers():Observable<MResponse>{

    let direccion = this.URLLocal +"User/ListConsult";
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}
