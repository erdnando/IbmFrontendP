import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReporteHorasTLS, ReqRepanioTLS } from "src/app/Models/MReporteHorasTLS";
import { ReqRepHorasTLS } from "src/app/Models/MReporteHorasTLS";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';




@Injectable({
  providedIn: 'root'
})
export class ApiDashboard {

  private URLLocal = Global.Url;
 // url:string ="http://localhost:5201/api/v1/";

  constructor(private http:HttpClient)
  { }

  GetReporteHorasTLS(mDashboard:ReqRepHorasTLS):Observable<MResponse> | undefined{

    let direccion = this.URLLocal +"Dashoard/Reporte1/";
    console.log(direccion);
    return this.http.get<MResponse>(direccion+mDashboard.semana+"/"+mDashboard.usuario+"/"+mDashboard.anio);
  }

  GetReporteAnioTLS(mDashboard:ReqRepanioTLS):Observable<MResponse> | undefined{

    let direccion = this.URLLocal +"Dashoard/ReporteGraficas/";
    console.log(direccion);
    return this.http.get<MResponse>(direccion+mDashboard.anio+"/"+mDashboard.usuario);
  }
  
}
