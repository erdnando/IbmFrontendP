import { EventEmitter, Injectable } from '@angular/core';
import { ListCountryService } from '../../AdminViews/AdminCountries/services/list-country/list-country.service';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import { MRol } from 'src/app/Models/MRol';
import { RolesListService } from '../../AdminViews/AdminRoles/services/rolesList/roles-list.service';
import { ClientService } from '../../AdminViews/AdminClients/services/client/client.service';
import { MClientEntity } from 'src/app/Models/MClienteEntity';
import { MAprobador } from 'src/app/Models/MAprobador';
import { ApproverListService } from '../../AdminViews/AdminApprover/services/approverList/approver-list.service';
import { FestivosListService } from '../../Views/parameters/services/festivosList/festivos-list.service';
import { MFestivos } from 'src/app/Models/MFestivos';
import { MenusListService } from '../../AdminViews/AdminRoles/services/menusList/menus-list.service';
import { MMenu } from 'src/app/Models/MMenu';
import { UserConsultRolService } from '../../Views/user/services/userConsultRol/user-consult-rol.service';
import { ListUsersService } from '../../AdminViews/AdminRoles/services/listUsers/list-users.service';
//import { Global } from 'src/app/global';
import { ConsultaHorarioUserService } from 'src/app/Views/parameters/services/consultaHorarioUser/consulta-horario-user.service';
import { MCreateHorario } from 'src/app/Models/MHorario';
import { ApproverTimeService } from 'src/app/Views/aprovve-time/services/approverTime/approver-time.service';
import { ListExceptionService } from 'src/app/AdminViews/usersExceptions/service/listExceptionService/list-exception.service';
import { UserConsultCountryService } from 'src/app/Views/user/services/userConsultCountry/user-consult-country.service';
import { UserExceptionsConsultCountryService } from 'src/app/Views/user/services/userConsultCountry/user-exceptions-consult-country.service';
import { RolesMenuService } from 'src/app/AdminViews/AdminRoles/services/rolesMenu/roles-menu.service';
import { Guid } from 'guid-typescript';
import { ReportExceptionService } from 'src/app/AdminViews/usersExceptions/service/reportExceptionService/report-exception.service';
import { WorkdayExceptionService } from 'src/app/AdminViews/usersExceptions/service/workdayExceptionService/workday-exception.service';
import { LoadService } from '../load/load.service';


interface MiObjeto {
  [key: string]: any;
}


@Injectable({
  providedIn: 'root'
})
export class ObtenerlistaService {
  ee: EventEmitter<number> = new EventEmitter<number>();
  counterAprobaciones = 0;
  
  private countryListSubject = new Subject<MCountryEntity[]>();
  countryList$ = this.countryListSubject.asObservable();

  MListCountry: MCountryEntity [];
  MRoles: MRol[];
  MClients: MClientEntity[];
  MApprovers: MAprobador[];
  MFestivos: MFestivos[];
  MMenu : MMenu[];
  mHorarioList: MCreateHorario[] = [];
  private _refreshClients$ = new Subject<any>();
  private _refreshApprovers$ = new Subject<any>();
  private _refreshFestivosdb$ = new Subject<any>();
  private _refreshCountries$ = new Subject<any>();
  private _refreshMenus$ = new Subject<any>();
  private _refreshRoles$ = new Subject<any>();
  private _refreshUserException$ = new Subject<any>();
  private _refreshListUsersRol$ = new Subject<any>();
  private _refreshListUsersCountry$ = new Subject<any>(); 
  private _refreshListUsersExceptionsCountry$ = new Subject<any>(); 
  private _refreshReportException$ = new Subject<any>(); 
  private _refreshWorkdayException$ = new Subject<any>();
  private _refreshLoadList$ = new Subject<any>();
  private _refreshInconsistence$ = new Subject<any>(); 
  private _refreshListUser$ = new Subject<any>();
  private _refreshAppTime$ = new Subject<any>();

  constructor(
    private apiListCountry: ListCountryService, 
    private apiListRoles: RolesListService, 
    private apiListClients: ClientService, 
    private apiListApprovers: ApproverListService, 
    private apiListFestivos: FestivosListService, 
    private apiListMenus: MenusListService,
    private apiRolMenu: RolesMenuService, 
    private userConsultRol: UserConsultRolService,
    private userConsultCountry: UserConsultCountryService, 
    private userExceptionsConsultCountry: UserExceptionsConsultCountryService, 
    private apilistUsers: ListUsersService,
    private apiConsultHotario: ConsultaHorarioUserService,
    private consultApproverTime: ApproverTimeService,
    private listUsersExceptions: ListExceptionService,
    private reportExceptions: ReportExceptionService,
    private workdayExceptions: WorkdayExceptionService,
    private load: LoadService,
    ) {
      this.MListCountry = [];
      this.MRoles = [];
      this.MClients = [];
      this.MApprovers = [];
      this.MFestivos = [];
      this.MMenu = [];
    }

   get refreshCountries$(){
    return this._refreshCountries$.asObservable();
  }

  public loadCountriesRefresh(){
    this.apiListCountry.GetCountry().pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshCountries$.next(listap)
        console.log(listap);
      });
}


  loadCountries(): Observable<any[]> {
    return this.apiListCountry.GetCountry().pipe(
      map((data: MiObjeto) => {
        let lista = data["data"];
        this.MListCountry = lista;
        console.log(this.MListCountry);
        console.log(typeof ((this.MListCountry[0]).idCounty) + " verificacion");
        return this.MListCountry;
      })
    );
  }

  get refreshRoles$(){
    return this._refreshRoles$.asObservable();
  }

  public loadRolesRefresh(){

    this.apiListRoles.GetRol().pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshRoles$.next(listap)
        console.log(listap);
      });
}




  loadRoles(): Observable<any[]> {
    return this.apiListRoles.GetRol().pipe(
      map((data: MiObjeto) => {
        let lista = data["data"];
        this.MRoles = lista;
        console.log(this.MRoles);
        console.log(typeof ((this.MRoles[0]).idRole) + " verificacion");
        return this.MRoles;
      })
    );
  }

  get refreshClients$(){
    return this._refreshClients$.asObservable();
  }

  public loadClientsRefresh(){
    console.log("ESTO ES ANTES DEL LOAD RFRESH")
    this.apiListClients.GetClient().pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshClients$.next(listap)
        console.log(listap);
      });
}


  loadClients(): Observable<any[]> {
    return this.apiListClients.GetClient().pipe(
      map((data: MiObjeto) => {
        let lista = data["data"];
        this.MClients = lista;
        console.log(this.MClients);
        return this.MClients;
      })
    );
  }

  get refreshApprovers$(){
    return this._refreshApprovers$.asObservable();
  }

  public loadApproversRefresh(){
    this.apiListApprovers.GetApprover().pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshApprovers$.next(listap)
        console.log(listap);
      });
}



  loadApprovers(): Observable<any[]> {
    return this.apiListApprovers.GetApprover().pipe(
      map((data: MiObjeto) => {
        let lista = data["data"];
        this.MApprovers = lista;
        console.log(this.MApprovers);
        return this.MApprovers;
      })
    );
  }

  get refreshFestivosdb$(){
    return this._refreshFestivosdb$.asObservable();
  }

  loadFestivos(id: string): Observable<any[]> {
    return this.apiListFestivos.GetFestivos(id).pipe(
      map((data: MiObjeto) => {
        let lista = data["data"];
        this.MFestivos = lista;
        this._refreshFestivosdb$.next(lista)
        console.log(this.MFestivos);
        return this.MFestivos;
      })
    );
  }

  get refreshMenus$(){
    return this._refreshMenus$.asObservable();
  }

  public loadMenusRefresh(){
    this.apiListMenus.GetMenu().pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshMenus$.next(listap)
        console.log(listap);
      });
}


  loadMenus(): Observable<any[]> {
    return this.apiListMenus.GetMenu().pipe(
      map((data: MiObjeto) => {
        let lista = data["data"];
        this.MMenu = lista;
        console.log(this.MMenu);
        return this.MMenu;
      })
    );
  }

  loadMenusByRol(idRol: Guid): Observable<any[]> {
    return this.apiRolMenu.ListByIdRol(idRol).pipe(
      map((data: MiObjeto) => {
        return data["data"];
      })
    );
  }


  get refreshListUsersRol$(){
    return this._refreshListUsersRol$.asObservable();
  }

  get refreshListUsersCounty$(){
    return this._refreshListUsersCountry$.asObservable();
  }

  get refreshListUsersExceptionsCounty$(){
    return this._refreshListUsersExceptionsCountry$.asObservable();
  }

  public consulUserCountry(id: string){
    this.userConsultCountry.GetUserConsultCountry(id).pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshListUsersCountry$.next(listap)
        console.log(listap+"este es el listado de usuarios por pais");
      });
  }

  public consulUsersExceptionsCountry(id: string){
    this.userExceptionsConsultCountry.GetUsersExceptionConsultCountry(id).pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshListUsersExceptionsCountry$.next(listap)
        console.log(listap+"este es el listado de usuarios con excepcion por pais");
      });
  }

  public consulUserRol(id: string){
    this.userConsultRol.GetUserConsultRol(id).pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshListUsersRol$.next(listap)
        console.log(listap+"este es el listado de usuarios por rol");
      });
  }

  get refreshListUser$(){
    return this._refreshListUser$.asObservable();
  }

  public listaUsers(){
    this.apilistUsers.GetUsers().pipe(
      map((data: MiObjeto) => data)).subscribe((data) => {
        let listap = data["data"];
        this._refreshListUser$.next(listap)
        console.log(listap+"este es el listado de usuarios por rol");
      });
  }

  loadHorarios(id: string, date: Date): Observable<any[]>{
    return this.apiConsultHotario.GetHorario(id, date).pipe(
      map((data: MiObjeto) => {
        let lista = data["data"];
        this.mHorarioList = lista;
        console.log(this.mHorarioList);
        return this.mHorarioList;
      })
    );
  }

  loadApproverTime(idUser: any){

    console.log('obteniedno aprobaciones...'+ idUser);
    this.consultApproverTime
    .GetApproverTime(idUser)
    .pipe(map((data: MiObjeto) => data))
    .subscribe((data) => {
      let lista = data['data'];

      console.log('datos obtenidos;;;;');
      console.log(lista);

      //emite evento del contador de notificaciones
      //==================================================
      console.log('emitiendo evento desde obtenerLista.service;;;;');
      this.counterAprobaciones=lista.length;
      this.ee.emit(this.counterAprobaciones);
      //=============================================
      this._refreshAppTime$.next(lista) ;
    });
  }

  get refreshAppTime$(){
    return this._refreshAppTime$.asObservable();
  }


  loadListUsersExceptions(){
    this.listUsersExceptions
    .GetListExceptions()
    .pipe(map((data: MiObjeto) => data))
    .subscribe((data) => {
      let lista = data['data'];
      this._refreshUserException$.next(lista) ;
    });
  }
  
  loadListReportExceptions(){
    this.reportExceptions
    .GetListExceptions()
    .pipe(map((data: MiObjeto) => data))
    .subscribe((data) => {
      let lista = data['data'];
      this._refreshReportException$.next(lista) ;
    });
  }
  
  loadListWorkdayExceptions(){
    this.workdayExceptions
    .GetListExceptions()
    .pipe(map((data: MiObjeto) => data))
    .subscribe((data) => {
      let lista = data['data'];
      this._refreshWorkdayException$.next(lista) ;
    });
  }

  loadListLoads(){
    this.load
    .GetListLoads()
    .pipe(map((data: MiObjeto) => data))
    .subscribe((data) => {
      let lista = data['data'];
      this._refreshLoadList$.next(lista) ;
    });
  }

  loadListInconsistencies(idCarga: string | null = null, employeeCode: string | null = null) {
    this.load
    .GetListInconsistencies(idCarga, employeeCode)
    .pipe(map((data: MiObjeto) => data))
    .subscribe((data) => {
      let lista = data['data'];
      this._refreshInconsistence$.next(lista) ;
    });
  }

  get refreshUserException$(){
    return this._refreshUserException$.asObservable();
  }

  get refreshReportException$(){
    return this._refreshReportException$.asObservable();
  }

  get refreshWorkdayException$(){
    return this._refreshWorkdayException$.asObservable();
  }

  get refreshLoadList$(){
    return this._refreshLoadList$.asObservable();
  }

  get refreshInconsistence$(){
    return this._refreshInconsistence$.asObservable();
  }

}
