import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Guid } from 'guid-typescript';
import { Global } from 'src/app/global';
//import { Global } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class ConsultaHorarioUserService {

  private URLLocal = Global.Url;

  constructor(private http:HttpClient)
  { }

  GetHorario(idUser: string, date: Date):Observable<MResponse>{

    let direccion = this.URLLocal +"Horario/ConsultIdUserW?IdUser="+idUser+"&date="+date.toISOString();
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }

}
