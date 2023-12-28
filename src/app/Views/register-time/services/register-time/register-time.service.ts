import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MCreateHorusReport } from "src/app/Models/MHorusReport";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class RegisterTimeService {

  private URLLocal = Global.Url;
  //url:string ="https://localhost:2429/api/v1/";

  constructor(private http:HttpClient)
  { }

  async PostCreateReport(mReport:MCreateHorusReport):Promise<Observable<MResponse>>{

    let direccion = this.URLLocal +"HorusReport/create";
    console.log(direccion);
    console.log(mReport);
    console.log(JSON.stringify(mReport));
    return await this.http.post<MResponse>(direccion,mReport);

  }


}
