import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MLogin } from "src/app/Models/MLogin";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';




@Injectable({
  providedIn: 'root'
})
export class ApiLogin {

  private URLLocal = Global.Url;
  
  constructor(private http:HttpClient)
  { }

  GetLogin(muser:MLogin):Observable<MResponse>{

    let direccion = this.URLLocal +"User/Login";
    console.log("login......");
    console.log(direccion);
    return this.http.post<MResponse>(direccion,muser);

  }


}
