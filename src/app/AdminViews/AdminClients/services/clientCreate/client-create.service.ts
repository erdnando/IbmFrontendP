import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MClientEntity } from "src/app/Models/MClienteEntity";
import { MParameters } from "src/app/Models/MParameters";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class ClientCreateService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  PostCreateClient(mClient:MClientEntity):Observable<MResponse>{

    let direccion = this.URLLocal +"Client/create";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mClient);

  }

}
