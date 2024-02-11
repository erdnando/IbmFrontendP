import {Component,EventEmitter,HostListener,OnInit,Output,} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, map } from 'rxjs';
import { LoadToolbarService } from 'src/app/Plantillas/toolbar/services/LoadToolbar/LoadToolbar.service';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { MMenu } from 'src/app/Models/MMenu';
import { MRolMenu } from 'src/app/Models/MRolMenu';
import { animate,keyframes,style,transition,trigger,} from '@angular/animations';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';
import { Guid } from 'guid-typescript';
import { ApproverTimeService } from 'src/app/Views/aprovve-time/services/approverTime/approver-time.service';

interface SideNavTogg1e {
  screenWidth: number;
  collapsed: boolean;
}

interface MiObjetoApp {
  [key: string]: any;
}

interface MiObjNotif {
  [key: string]: any;
}


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('150ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  ee: EventEmitter<number> = new EventEmitter<number>();
  counterNotif: number;
  private _refreshAppTime$ = new Subject<any>();

  
  Close: boolean = false;

  @Output() onToggleSideNav: EventEmitter<SideNavTogg1e> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;

  Role: any;
  EnableButton: boolean = true;
  idPaisSeleccionado: string = '';

  ListCountry: MCountryEntity[] = [];
  MUser: MUserEntity | null = null;
  Mmen: MRolMenu[] = [];
  

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    if (this.Close == false) {
      this.closeSidenav();
    }
    this.Close = false;
  }

  paisSeleccionado: string | null | undefined = '';

  ngOnInit(): void {
    this.MUser = this.storageService.obtenerDatosMapeados();
    if (this.MUser) {
      this.paisSeleccionado = this.MUser?.countryEntity?.nameCountry;
      console.log('Nombre Rol : ' + this.MUser!.rolEntity?.nameRole)
      if (this.MUser!.rolEntity?.nameRole == 'Super Administrador') {
        console.log(this.MUser!.rolEntity.nameRole)
        this.EnableButton = false;
        this.listCountryService.loadCountries().subscribe((paises) => {
          this.ListCountry = paises;
        });
      }
  
      this.enviarPaisSeleccionado();
      this.screenWidth = window.innerWidth;
  
      this.idPaisSeleccionado = this.MUser!.countryEntity.idCounty.toString();
      this.paisSeleccionado = this.MUser!.countryEntity.nameCountry;
      this.Role = this.MUser!.rolEntity.idRole;
      this.cergarMenuList();
      this.cargaNotificaciones(this.MUser!.idUser);
    }

    this.listCountryService.ee.subscribe(counterNotif => {
      console.log("consumiento evento notificacion de aprobaciones");
      console.log(counterNotif);

      this.counterNotif = counterNotif;
    });
  }

  constructor(
    private storageService: StorageService,
    private router: Router,
    private loadToolbarService: LoadToolbarService,
    private listCountryService: ObtenerlistaService,
    private rutaActual: RutaActualService,
    private consultApproverTime: ApproverTimeService,
   ) {
      this.counterNotif=0;
   }

  enviarPaisSeleccionado() {
    let value = this.paisSeleccionado || '';
    this.rutaActual.setglobalVar(value, this.idPaisSeleccionado);
  }

  seleccionarPais(pais: string, idPais: any) {
    this.idPaisSeleccionado = idPais;
    this.paisSeleccionado = pais;
    this.enviarPaisSeleccionado();
  }

  Redireccion() {
    this.router.navigate(['user']);
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth,});
  }

  toggleopen(): void {
    this.collapsed =true;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth,});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth,});
  }

  async cergarMenuList() {
    
    this.MUser = this.storageService.obtenerDatosMapeados();
    if (this.MUser) {
      console.log("Rol autenticado:::"+this.MUser.roleEntityId);
      (await this.loadToolbarService.PostLoadToolbar(this.MUser.roleEntityId))
        .pipe(map((data: MiObjetoApp) => data))
        .subscribe((data) => {
          let listap = data['data'];

          this.Mmen = listap;
         
        });
    } else {
      console.log("No se puede cargar el rol")
    }
  }

  showInfo(link: string) {
    this.router.navigate([link]);
  }

  cerrarSesion() {
    this.storageService.eliminarDatosGuardados();
    this.router.navigate(['login']);
  }

  onContentClickSidenav() {
    this.Close = true;
  }

  cargaNotificaciones(idUser: any){

    console.log('obteniedno aprobaciones...'+ idUser);
    this.consultApproverTime
    .GetApproverTime(idUser)
    .pipe(map((data: MiObjNotif) => data))
    .subscribe((data) => {
      let lista = data['data'];

      console.log('datos obtenidos;;;;');
      console.log(lista);

      //emite evento del contador de notificaciones
      //==================================================
      
      this.counterNotif=lista.length;
      console.log('emitiendo evento en la carga inicial dela aplicacion:::'+this.counterNotif);
      
      //this.ee.emit(this.counterNotif);
      
      //=============================================
      //this._refreshAppTime$.next(lista) ;
    });
  }

  /*get refreshAppTime$(){
    return this._refreshAppTime$.asObservable();
  }*/

 
}

