import {Component,EventEmitter,HostListener,OnInit,Output,} from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { LoadToolbarService } from 'src/app/Plantillas/toolbar/services/LoadToolbar/LoadToolbar.service';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { MMenu } from 'src/app/Models/MMenu';
import { MRolMenu } from 'src/app/Models/MRolMenu';
import { animate,keyframes,style,transition,trigger,} from '@angular/animations';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';

interface SideNavTogg1e {
  screenWidth: number;
  collapsed: boolean;
}

interface MiObjetoApp {
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
        animate('350ms', style({ opacity: 0 })),
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
  Close: boolean = false;

  @Output() onToggleSideNav: EventEmitter<SideNavTogg1e> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;

  Role: any;
  EnableButton: boolean = true;
  idPaisSeleccionado: string = '';

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

  paisSeleccionado: string = '';

  ngOnInit(): void {
    this.paisSeleccionado = this.MUser.countryEntity.nameCountry;
    console.log(this.MUser.rolEntity.nameRole)
    if (this.MUser.rolEntity.nameRole == 'Super Administrador') {
      console.log(this.MUser.rolEntity.nameRole)
      this.EnableButton = false;
      this.listCountryService.loadCountries().subscribe((paises) => {
        this.ListCountry = paises;
      });
    }

    this.enviarPaisSeleccionado();
    this.screenWidth = window.innerWidth;
  }

  constructor(private storageService: StorageService,private router: Router,private loadToolbarService: LoadToolbarService,private listCountryService: ObtenerlistaService,private rutaActual: RutaActualService) {
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.ngOnInit();
    this.idPaisSeleccionado = this.MUser.countryEntity.idCounty.toString();
    this.paisSeleccionado = this.MUser.countryEntity.nameCountry;
    this.Role = this.MUser.rolEntity.idRole;
    this.Mmen = [] as MRolMenu[];
    this.cergarMenuList();
    }

  ListCountry: MCountryEntity[] = [];
  MUser: MUserEntity;
  Mmen: MRolMenu[];

  enviarPaisSeleccionado() {
    this.rutaActual.setglobalVar(this.paisSeleccionado,this.idPaisSeleccionado);
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

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth: this.screenWidth,});
  }

  async cergarMenuList() {
    this.MUser = this.storageService.obtenerDatosMapeados();
    if (this.MUser) {
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
}

