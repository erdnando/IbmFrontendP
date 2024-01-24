import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MHorarioRegistrado } from "src/app/Models/MHorarioRegistrado";
import { MCreateHorusReport, MCreatePortalDB, MPortalDBResponse } from "src/app/Models/MHorusReport";
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
  async PostCreatePortalDbReport(mReport:MCreateHorusReport):Promise<Observable<MPortalDBResponse>>{

    let direccion = this.URLLocal +"HorusReport/createPortal";
    console.log(direccion);
    console.log(mReport);
    console.log(JSON.stringify(mReport));
    return await this.http.post<MPortalDBResponse>(direccion,mReport);

  }

  async GetConsultHorarioByWeek(fechaP:MHorarioRegistrado):Promise<Observable<MResponse>>{

    let direccion = this.URLLocal +"Horario/ConsultIdUserW?IdUser="+fechaP.userEntityId+"&week="+fechaP.week+"&ano="+fechaP.ano;
    
    console.log(direccion);
    return await this.http.get<MResponse>(direccion);

  }


}
