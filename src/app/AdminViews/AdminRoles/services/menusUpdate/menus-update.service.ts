import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MClientEntity } from "src/app/Models/MClienteEntity";
import { MMenu } from "src/app/Models/MMenu";
import { MParameters } from "src/app/Models/MParameters";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';



@Injectable({
  providedIn: 'root'
})
export class MenusUpdateService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  PostCreateMenu(mMenu:MMenu):Observable<MResponse>{

    let direccion = this.URLLocal +"Menu/Update";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mMenu);

  }
}
