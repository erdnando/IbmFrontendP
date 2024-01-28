import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MResponse } from 'src/app/Models/MResponse';
import { Global } from 'src/app/global';



@Injectable({
  providedIn: 'root'
})
export class UserConsultCountryService {

  private URLLocal = Global.Url;

  constructor(private http:HttpClient)
  { }

  GetUserConsultCountry(id: string):Observable<MResponse>{

    let direccion = this.URLLocal +"User/GetByCountryList?Id="+id;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}