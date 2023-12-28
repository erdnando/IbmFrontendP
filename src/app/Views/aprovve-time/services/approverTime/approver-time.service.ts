import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Guid} from "guid-typescript";
import { Observable } from "rxjs";
import { MClientEntity } from "src/app/Models/MClienteEntity";
import { MParameters } from "src/app/Models/MParameters";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';



@Injectable({
  providedIn: 'root'
})
export class ApproverTimeService {

  private URLLocal = Global.Url;
  //url:string ="http://localhost:2429/";

  constructor(private http:HttpClient)
  { }

  GetApproverTime(idUser: Guid):Observable<MResponse>{

    let direccion = this.URLLocal +"Assignment/GetListUserAproveed?IdUser="+ idUser;
    console.log(direccion);
    return this.http.get<MResponse>(direccion);

  }
}
