import { Component, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { ReqRepHorasTLS } from "src/app/Models/MReporteHorasTLS";
import { ReporteHorasTLS } from "src/app/Models/MReporteHorasTLS";
import { WeekDaysTls } from "src/app/Models/MReporteHorasTLS";
import { RepGralHoras } from "src/app/Models/MReporteHorasTLS";
import { ApiDashboard } from 'src/app/Views/Dashboard/services/api.Dashboard';
import { MatTableDataSource } from '@angular/material/table';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

interface SideNavTogg1e {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-dashboard',
  templateUrl:'./Dashboard.component.html',
  styleUrls: ['./Dashboard.component.css']
})
export class DashboardComponent {

  @ViewChild("chartObj") chart!: ChartComponent ;
  public chartOptions: Partial<ChartOptions>;

  _reqRepHorasTLS : ReqRepHorasTLS;
  _reporteGral : ReporteHorasTLS[];
  datadias: Array<WeekDaysTls>=[];
  repGralDias : Array<RepGralHoras> =[];
  repgralUnit: RepGralHoras;
  dtOptions:any={};
  MUser: MUserEntity;
  columnasAMostrar = ['Tool', 'dia1', 'dia2', 'dia3', 'dia4','dia5','dia6','dia7'];
  currentDate = new Date();
  weekNumber:number=0;

  constructor(private storageData: StorageService, private router: Router,private _apiDashboard:ApiDashboard) {
    this.chartOptions = {
      series: [
        {
          name: "Mi serie",
          data: [10,41,35,51,49,62,91,148]
        }
      ],
      chart:{
        height:230,
        width:700,
        type:"bar"
      },
      title:{
        text:"Angular chart"
      },
      xaxis:{
        categories:["Jan","Feb","Mar","Abr","May","Jun","Jul","Aug","Sep","Oct","Nov","DEc"]
      }
    };

    this._reqRepHorasTLS= {} as ReqRepHorasTLS;
    this._reporteGral =[] as ReporteHorasTLS[];
    this.repgralUnit={} as RepGralHoras;
    this.MUser = this.storageData.obtenerDatosMapeados();
    
  }

  isSideNavCoIIapsed = false;
  noSemana: number = 1;
  screenWidth = 0;
  title="Dashboard";
  mListHorusReport = new MatTableDataSource<any>();


  ngOnInit() {
    let startDate = new Date(this.currentDate.getFullYear(), 0, 1);
    let days = Math.floor((Number(this.currentDate) - Number(startDate)) /(24 * 60 * 60 * 1000));
    this.noSemana = Math.ceil(days / 7);
    this.getReqRepHorasTLS();
    this.dtOptions={
      pagingType:'full_numbers',
      resposive:true,

    };
  
  }

  

 

  valuechange(newValue:number) {
    
    if (newValue>52 || newValue<=0 || newValue==null) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención!',
        text:'El número de semana deberá estar entre 1 y 52'
    });
    }else {
      this.noSemana = newValue;
      console.log(newValue);
      this.getReqRepHorasTLS();
    }
    
  }

  getReqRepHorasTLS(){
    this._reqRepHorasTLS.semana=this.noSemana;
    this._reqRepHorasTLS.usuario='083368';//this.MUser.employeeCode.toString();
    
    //this._reqRepHorasTLS.usuario=sessionStorage.getItem("User").toString();

    try {
      this._apiDashboard.GetReporteHorasTLS(this._reqRepHorasTLS)?.pipe(
        map((data: any) => {
          this.datadias=[];
          this._reporteGral=[];
          this.repGralDias=[];
          if (data && data.data) {
            this.mListHorusReport=data.data
            this._reporteGral=data.data
  
            this._reporteGral.forEach((dat: ReporteHorasTLS)  => {
              this.repgralUnit={} as RepGralHoras;
              this.repgralUnit.tool = dat.tool;
              this.repgralUnit.dia1=dat.weekDaysTls[0].totalHoras.toString();
              this.repgralUnit.dia2=dat.weekDaysTls[1].totalHoras.toString();
              this.repgralUnit.dia3=dat.weekDaysTls[2].totalHoras.toString();
              this.repgralUnit.dia4=dat.weekDaysTls[3].totalHoras.toString();
              this.repgralUnit.dia5=dat.weekDaysTls[4].totalHoras.toString();
              this.repgralUnit.dia6=dat.weekDaysTls[5].totalHoras.toString();
              this.repgralUnit.dia7=dat.weekDaysTls[6].totalHoras.toString();
              this.repGralDias.push(this.repgralUnit);
  
            });
  
  
            data.data[0].weekDaysTls.forEach((data: WeekDaysTls) => {
              this.datadias.push(data)
            });
            console.log(data.data)
            return this.mListHorusReport;
          } else {
    
            return null;
          }
        })
      ).subscribe(dataMapeada => {
        if (dataMapeada) {
          // Swal.fire({
          //   icon: 'success',
          //   title: 'Bienvenido',
          // });
          
          
        } else {
          // Swal.fire({
          //   icon: 'error',
          //   title: 'Oops...',
          //   text: 'Error en el inicio de sesión, correo o contraseña incorrectos.',
          // });
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al llamar la API: ' + error.message,
        });
      })      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error ' + error,
      });
    }  
  }


  onToggleSideNav(data: SideNavTogg1e){
    this.screenWidth = data.screenWidth;
    this.isSideNavCoIIapsed = data.collapsed;
  }
}
