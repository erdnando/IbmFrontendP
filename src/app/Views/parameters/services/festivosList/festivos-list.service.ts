import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MResponse } from 'src/app/Models/MResponse';
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class FestivosListService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetFestivos(idCountry: string):Observable<MResponse>{

    let direccion = this.URLLocal +"Festivos/ListAllFestivo?CountryId="+idCountry;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}
