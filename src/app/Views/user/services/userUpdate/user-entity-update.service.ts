import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {MUserUpdate} from "src/app/Models/MUserUpdate"
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class UserUpdateService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  PostUserUpdate(mUserUpdate:MUserUpdate):Observable<MResponse>{

    let direccion = this.URLLocal +"User/Update";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mUserUpdate);

  }


}