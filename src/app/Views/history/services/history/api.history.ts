import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Guid } from "guid-typescript";
import { Observable } from "rxjs";
import { MCreateHorusReport } from "src/app/Models/MHorusReport";
import { MResponse } from "src/app/Models/MResponse";
import { Global } from 'src/app/global';



@Injectable({
  providedIn: 'root'
})
export class ApiHistory {

  private URLLocal = Global.Url;
  //url:string ="https://localhost:2429/api/v1/";

  constructor(private http:HttpClient)
  { }

  async PostListReport(iduser:Guid):Promise<Observable<MResponse>>{

    let direccion = this.URLLocal +"HorusReport/ListHoursUser?User="+iduser;
    console.log(direccion);
    return await this.http.get<MResponse>(direccion);

  }

}

// url:string ="https://localhost:7299/api/";

//   constructor(private http:HttpClient) { }


//   GetBiblioteca():Observable<SLibrosI[]>{
//     let header = new HttpHeaders().set("Authorization","Bearer "+ localStorage.getItem("Tok") as string);
//     console.log(header);
//     let direccion = this.url + "Biblioteca/GetLibros" ;
//     console.log(direccion);
//     return this.http.get<SLibrosI[]>(direccion,{headers:header});
//   }
//   GetDetalleBilioteca(id:string,login:SLoginI):Observable<SDetalleLI>{

//     let header = new HttpHeaders().set("Authorization","Bearer "+ localStorage.getItem("Tok") as string);
//     let direccion = this.url + "Biblioteca/GetLibroDetalle/"+id;
//     return this.http.get<SDetalleLI>(direccion,{headers:header});

//   }
//   GetToken(Loginto:SLoginI):Observable<SResponseI>{

//     let direccion = this.url  + "Auth/Login";
//     return this.http.post<SResponseI>(direccion,Loginto);

//   }






// }
