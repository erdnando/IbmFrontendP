import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MCreateHorario } from "src/app/Models/MHorario";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class HorarioCreateService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  PostCreateHorario(mHorario:MCreateHorario[]):Observable<MResponse>{

    let direccion = this.URLLocal +"Horario/create";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mHorario);

  }

  PostCreateHorario1(mHorario:MCreateHorario[]):Observable<MResponse>{

    let direccion = this.URLLocal +"Horario/create1";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mHorario);

  }

  PostCreateHorario2(mHorario:MCreateHorario[]):Observable<MResponse>{

    let direccion = this.URLLocal +"Horario/create2";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mHorario);

  }

  PostCreateHorario3(mHorario:MCreateHorario[]):Observable<MResponse>{

    let direccion = this.URLLocal +"Horario/create3";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mHorario);

  }
  
}
