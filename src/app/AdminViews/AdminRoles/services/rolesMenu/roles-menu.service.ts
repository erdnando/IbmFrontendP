import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';
import { Guid } from 'guid-typescript';
import { MMenu } from 'src/app/Models/MMenu';

@Injectable({
  providedIn: 'root'
})
export class RolesMenuService {

  private URLLocal = Global.Url;

  constructor(private http:HttpClient)
  { }

  ListByIdRol(idRol:Guid):Observable<MMenu[]>{
    let direccion = this.URLLocal +"RolMenu/ListByIdRol?Id="+idRol;
    console.log(direccion);
    return this.http.get<MMenu[]>(direccion);
  }
}