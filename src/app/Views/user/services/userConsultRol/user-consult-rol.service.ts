import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { MResponse } from 'src/app/Models/MResponse';
import { Global } from 'src/app/global';



@Injectable({
  providedIn: 'root'
})
export class UserConsultRolService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetUserConsultRol(id: string):Observable<MResponse>{

    let direccion = this.URLLocal +"User/GetByRolList?Id="+id;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}
