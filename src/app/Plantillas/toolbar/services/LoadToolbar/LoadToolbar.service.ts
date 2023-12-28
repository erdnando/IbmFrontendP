import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Guid } from 'guid-typescript';
import { MMenu } from 'src/app/Models/MMenu';
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class LoadToolbarService {
  
  private URLLocal = Global.Url;
  //urlstring ="http://localhost:2429/api/v1/";

  constructor(private http:HttpClient)
  { }

  PostLoadToolbar(idRol:Guid):Observable<MMenu[]>{
    let direccion = this.URLLocal +"RolMenu/ListByIdRol?Id="+idRol;
    console.log(direccion);
    return this.http.get<MMenu[]>(direccion);
  }
}
