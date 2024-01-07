import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { MFestivos } from "src/app/Models/MFestivos";
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class FestivosDeleteService {

  private URLLocal = Global.Url;

  constructor(private http:HttpClient)
  { }

  PostDeleteFestivo(mFestivo:MFestivos):Observable<MResponse>{

    let direccion = this.URLLocal +"Festivos/delete";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mFestivo);

  }
}
