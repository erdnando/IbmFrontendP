import { Component, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { ApiDashboard } from 'src/app/Views/dashboard/services/api.Dashboard';
import { MatTableDataSource } from '@angular/material/table';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';



interface SideNavTogg1e {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-saml',
  templateUrl:'./saml-callback.component.html',
  styleUrls: ['./saml-callback.component.css']
})
export class SamlCallbackComponent {


  dtOptions:any={};
  SAMLResponse: string | undefined;
  //MUser: MUserEntity;

  constructor(private storageData: StorageService, private router: Router,private route: ActivatedRoute, private _apiDashboard:ApiDashboard) {
    
console.log("on saml");
    //this.MUser = this.storageData.obtenerDatosMapeados();
    
  }

  isSideNavCoIIapsed = false;
  noSemana: number = 1;
  screenWidth = 0;
  title="Dashboard";
  mListHorusReport = new MatTableDataSource<any>();


  ngOnInit() {

    this.route.queryParams
      .subscribe(params => {
        console.log("::::::::::::::::::::::::::::::::::::::::::::");
        console.log(params); // { SAMLResponse }
        this.SAMLResponse = params['SAMLResponse'];
        console.log("::::::::::::::::::::::::::::::::::::::::::::");
        console.log(this.SAMLResponse); // SAMLResponse
      });
   
  }




  onToggleSideNav(data: SideNavTogg1e){
    this.screenWidth = data.screenWidth;
    this.isSideNavCoIIapsed = data.collapsed;
  }
}
