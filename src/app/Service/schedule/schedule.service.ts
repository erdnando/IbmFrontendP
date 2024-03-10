import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/app/global';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private URLLocal = Global.Url;
  
  constructor(
    private http: HttpClient
  ) {}

  getTemplate(): Observable<any> {
    return this.http.get(`${this.URLLocal}Horario/Template`, { observe: 'response', responseType: 'blob' });
  }

  

}
