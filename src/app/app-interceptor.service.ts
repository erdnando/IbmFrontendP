import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './Service/storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppInterceptorService implements HttpInterceptor {

  constructor(private storageService: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var datosmap = this.storageService.obtenerDatosMapeados()
    const token = datosmap == null ?"":datosmap.token;
    // const apiReq = req.clone({
    //   params: req.params.set('Authorization', 'Bearer ' + token)
    // });
    const authRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    return next.handle(authRequest);
  }
}