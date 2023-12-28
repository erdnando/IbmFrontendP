import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MResponse } from "src/app/Models/MResponse";
import { MUserCreate } from "src/app/Models/MUserCreate";
import { MUserException } from "src/app/Models/MUserException";
import { Global } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class UpdateExceptionService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  PostUpdateException(MUserException:MUserException):Observable<MResponse>{

    let direccion = this.URLLocal +"UsersException/Update";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,MUserException);

  }

}
