import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, throwError, timer } from 'rxjs';
import { StorageService } from './Service/storage-service/storage.service';
import { MLogin } from './Models/MLogin';
import { ApiLogin } from './Views/Login/services/login/api.login';

@Injectable({
  providedIn: 'root'
})
export class AppInterceptorService implements HttpInterceptor {

  Userlogin!: MLogin;
  constructor(private storageService: StorageService,private apiLogin:ApiLogin) {
    this.Userlogin = {} as MLogin;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var datosmap = this.storageService.obtenerDatosMapeados()
    const token = datosmap == null ?"":datosmap.token;
    const authRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });


    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Regenerando TOKEN Inicio")
          // Access token is expired, try refreshing
          this.Userlogin.userName = datosmap.idUser;
          this.Userlogin.password = datosmap.code;

          this.apiLogin.GetLogin(this.Userlogin).pipe(
            map((data: any) => {
            console.log(data);
              if (data && data.data) {
                const datosMapeados = {
                  idUser: data.data.idUser,
                  email: data.data.email,
                  nameUser: data.data.nameUser,
                  surnameUser: data.data.surnameUser,
                  employeeCode: data.data.employeeCode,
                  roleEntityId: data.data.roleEntityId,
                  countryEntityId: data.data.countryEntityId,
                  countryEntity: data.data.countryEntity,
                  rolEntity: data.data.roleEntity,
                  token:data.data.token,
                  code:data.data.password
                };
                this.storageService.guardarDatosMapeados(datosMapeados)
                //return datosMapeados;
                const authRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                });

                console.log("TOKEN Actualizado: " + data.data.token)
                return next.handle(authRequest);

              } else {
        
                return null;
              }
            })
          ).subscribe(dataMapeada => {
            if (dataMapeada) {
            } else {
            }
          });



        }
        return throwError(error);
      })
    );
  }
}