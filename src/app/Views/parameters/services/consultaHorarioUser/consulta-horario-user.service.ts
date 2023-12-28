import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { Guid } from 'guid-typescript';
import { Global } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class ConsultaHorarioUserService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetHorario(idUser: string, semana: string, ano: string):Observable<MResponse>{

    let direccion = this.URLLocal +"Horario/ConsultIdUserW?IdUser="+idUser+"&week="+semana+"&ano="+ano;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }

}
