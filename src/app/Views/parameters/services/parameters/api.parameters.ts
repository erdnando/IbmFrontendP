import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { MParameters } from "src/app/Models/MParameters";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class ApiParameters {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  private _refresh$ = new Subject<void>();

  constructor(private http:HttpClient)
  { }

  get refresh$(){
    return this._refresh$;
  }

  PostCreateParameter(mParameters:MParameters):Observable<MResponse>{

    let direccion = this.URLLocal +"Parameters/create";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mParameters);
  }

}
