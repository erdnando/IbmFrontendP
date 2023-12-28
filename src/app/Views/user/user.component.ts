import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { ApiLogin } from 'src/app/Views/Login/services/login/api.login';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { ApiUser } from 'src/app/Views/user/services/user/api.user';
import { MatDialog } from '@angular/material/dialog';

interface SideNavTogg1e {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  MUser:MUserEntity;

  constructor(private apiUser:ApiUser, private apiLogin:ApiLogin,private router:Router, private storageService: StorageService, public dialog: MatDialog)
  {
    this.MUser ={} as MUserEntity;
  }

  isSideNavCoIIapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavTogg1e): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCoIIapsed = data.collapsed;
  }

  ngOnInit():void{

  this.MUser = this.storageService.obtenerDatosMapeados();
  console.log(this.MUser.surnameUser)

  
  

    // this.apiUser.GetUser().subscribe(data=>{

    //   console.log(data);
    //   this.MUser = data;

    // })

  }






}
