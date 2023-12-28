import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MApproverTimeCreate } from "src/app/Models/MApproverTimeCreate";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from "src/app/global";


@Injectable({
  providedIn: 'root'
})
export class ApproverTimeCreateService {

  private URLLocal = Global.Url;

  constructor(private http:HttpClient)
  { }

  PostCreateApproverTime(mApprover:MApproverTimeCreate):Observable<MResponse>{

    let direccion = this.URLLocal +"Assignment/UpdateAproveedNivel1";
    console.log(direccion);
    return this.http.post<MResponse>(direccion,mApprover);

  }
}

