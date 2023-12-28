import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MClientEntity } from "src/app/Models/MClienteEntity";
import { MParameters } from "src/app/Models/MParameters";
import { MResponse } from "src/app/Models/MResponse";
import { MRol } from "src/app/Models/MRol";
import { Global } from 'src/app/global';



@Injectable({
  providedIn: 'root'
})
export class RolesCreateService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  PostCreateRol(mRol:MRol):Observable<MResponse>{

    let direccion = this.URLLocal +"Rol/create";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mRol);

  }
}
