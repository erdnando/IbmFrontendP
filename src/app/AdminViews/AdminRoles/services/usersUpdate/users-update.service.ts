import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MClientEntity } from "src/app/Models/MClienteEntity";
import { MParameters } from "src/app/Models/MParameters";
import { MResponse } from "src/app/Models/MResponse";
import { MUserCreate } from "src/app/Models/MUserCreate";
import { MUserEntity } from "src/app/Models/MUserEntity";
import { Global } from 'src/app/global';



@Injectable({
  providedIn: 'root'
})
export class UsersUpdateService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  PostUpdateUsers(mUser:MUserCreate):Observable<MResponse>{

    let direccion = this.URLLocal +"User/UpdateAll";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mUser);

  }
}
