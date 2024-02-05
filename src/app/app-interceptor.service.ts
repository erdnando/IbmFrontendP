import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, throwError, timer } from 'rxjs';
import { StorageService } from './Service/storage-service/storage.service';
import { MLogin } from './Models/MLogin';
import { MResponse } from './Models/MResponse';
import { ApiLogin } from './Views/Login/services/login/api.login';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AppInterceptorService implements HttpInterceptor {

  Userlogin!: MLogin;
  mResponse!:MResponse;
  constructor(private storageService: StorageService,private apiLogin:ApiLogin,private router: Router) {
    this.Userlogin = {} as MLogin;
    this.mResponse = {} as MResponse;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var datosmap = this.storageService.obtenerDatosMapeados()
    const token = datosmap == null ?"":datosmap.token;

    console.log(req.url);
    if(!req.url.endsWith("Login")){ 



   
        console.log("calling api");
        
        if(token!= ""){
          const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
          var tiempoRestante =expiry - (Math.floor((new Date).getTime() / 1000));
          console.log("tiempo de expiracion:::"+tiempoRestante);

          if(tiempoRestante<3500){
            //--------------------------
            Swal.fire({
              icon: 'warning',
              title: 'La sesión esta a punto de expirar!',
              allowOutsideClick:false,
              text:'Para continuar, renueve la sesión',
              confirmButtonColor: '#0A6EBD',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'Renovar sesión' , 
              cancelButtonText:'Salir' 
            }).then((willDelete) => {

              if(willDelete.value){
                //renovar
                var datosmap = this.storageService.obtenerDatosMapeados()
                this.Userlogin.userName = datosmap.email;
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
                        const authRequest = req.clone({
                                                          setHeaders: {
                                                            Authorization: `Bearer ${token}`
                                                          }
                                                        });

                    console.log("TOKEN Actualizado: " + data.data.token)
                    return  next.handle(authRequest);
        
                      
                      
                    } 
                    return next.handle(authRequest);
        
                  })
                ).subscribe(dataMapeada => {
                
                });
                //------------------------------------------------------------------------
              

              }else{
                //salir
                this.storageService.eliminarDatosGuardados();
                this.router.navigate(['login']);
              }
            //---------------------------
            });
          }
        }

    }

    const authRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });


    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Tu sesión ha terminado, por favor, vuelva a iniciar sesión para continuar!.',
            confirmButtonColor: '#0A6EBD',
          });
          this.storageService.eliminarDatosGuardados();
          this.router.navigate(['login']);
          // console.log("Regenerando TOKEN Inicio")
          // // Access token is expired, try refreshing
          // this.Userlogin.userName = datosmap.email;
          // this.Userlogin.password = datosmap.code;

          // this.apiLogin.GetLogin(this.Userlogin).pipe(
          //   map((data: any) => {
          //   console.log(data);
          //     if (data && data.data) {
          //       const datosMapeados = {
          //         idUser: data.data.idUser,
          //         email: data.data.email,
          //         nameUser: data.data.nameUser,
          //         surnameUser: data.data.surnameUser,
          //         employeeCode: data.data.employeeCode,
          //         roleEntityId: data.data.roleEntityId,
          //         countryEntityId: data.data.countryEntityId,
          //         countryEntity: data.data.countryEntity,
          //         rolEntity: data.data.roleEntity,
          //         token:data.data.token,
          //         code:data.data.password
          //       };
          //       this.storageService.guardarDatosMapeados(datosMapeados)
          //       //return datosMapeados;
          //       const authRequest = req.clone({
          //         setHeaders: {
          //           Authorization: `Bearer ${token}`
          //         }
          //       });

          //       console.log("TOKEN Actualizado: " + data.data.token)
          //       return next.handle(authRequest);

          //     } else {
        
          //       return null;
          //     }
          //   })
          // ).subscribe(dataMapeada => {
          //   if (dataMapeada) {
          //   } else {
          //   }
          // });



        }
        return throwError(error);
      })
    );
  }
}