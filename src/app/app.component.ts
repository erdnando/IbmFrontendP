import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from './Service/storage-service/storage.service';
import { MUserEntity } from './Models/MUserEntity';
import { Subject, Subscription } from 'rxjs';
import { RutaActualService } from './Service/rutaActual/ruta-actual.service';


interface SideNavTogg1e {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'IBM.HOURS';
  
  susciption: Subscription;

  prueba: MUserEntity;
  prueba2: string = "";


  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavTogg1e): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  constructor(private storageDates: StorageService, private cdr: ChangeDetectorRef, private rutaActual: RutaActualService){
      this.prueba = {} as MUserEntity;
      this.susciption = new Subscription();
      
  }

  ngOnInit(): void{
      console.log("app.component...");
    this.rutaActual.pathActual.subscribe(local => {
      console.log("login::::::::::");
      console.log(typeof local +"APPP***");
      this.prueba2 = local;
    })

  }



}
