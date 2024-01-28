import { Injectable } from '@angular/core';
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


interface MiObjeto {
  [key: string]: any;
}


@Injectable({
  providedIn: 'root'
})
export class ObtenerlistaService {

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
  private _refreshListUser$ = new Subject<any>();
  private _refreshAppTime$ = new Subject<any>();

  constructor(
    private apiListCountry: ListCountryService, 
    private apiListRoles: RolesListService, 
    private apiListClients: ClientService, 
    private apiListApprovers: ApproverListService, 
    private apiListFestivos: FestivosListService, 
    private apiListMenus: MenusListService, 
    private userConsultRol: UserConsultRolService, 
    private apilistUsers: ListUsersService,
    private apiConsultHotario: ConsultaHorarioUserService,
    private consultApproverTime: ApproverTimeService,
    private listUsersExceptions: ListExceptionService
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


  loadCountries(): Observable<MCountryEntity[]> {
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


  get refreshListUsersRol$(){
    return this._refreshListUsersRol$.asObservable();
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

  loadHorarios(id: string, semana: string, ano: string): Observable<any[]>{
    return this.apiConsultHotario.GetHorario(id, semana, ano).pipe(
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

  get refreshUserException$(){
    return this._refreshUserException$.asObservable();
  }

}
