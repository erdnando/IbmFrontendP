import { Component, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MonthTls, ReporteHorasMesTLS, ReqRepHorasTLS, ReqRepanioTLS } from "src/app/Models/MReporteHorasTLS";
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
import * as ApexCharts from 'apexcharts';

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
  templateUrl:'./dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  @ViewChild("chartObject") chart!: ChartComponent ;
 // @ViewChild("chartBar2") chart2!: ChartComponent ;

  public chartOptions: Partial<ChartOptions>;
  public chartOptionsOvertime: Partial<ChartOptions>;

  _reqRepHorasTLS : ReqRepHorasTLS;
  _reqRepAnioTLS :ReqRepanioTLS  
  _reporteGral : ReporteHorasTLS[];
  _reporteGralStandBy : ReporteHorasTLS[];
  _reporteGralOver : ReporteHorasTLS[];
  datadias: Array<WeekDaysTls>=[];
  repGralDias : Array<RepGralHoras> =[];
  repGralDiasStandBy : Array<RepGralHoras> =[];
  repGralDiasOver : Array<RepGralHoras> =[];
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
          data: [10,34,12,0,30,0,0,20]
        }
      ],
      chart:{
        height:230,
        width:700,
        type:"bar"
      },
      title:{
        text:"StandBy"
      },
      xaxis:{
        categories:["Jan","Feb","Mar","Abr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      }
    };

    this.chartOptionsOvertime = {
      series: [
        {
          name: "Mi serie",
          data: [10,0,20,0,40,0,20,6]
        }
      ],
      chart:{
        height:230,
        width:700,
        type:"bar"
      },
      title:{
        text:"Overt Timer"
      },
      xaxis:{
        categories:["Jan","Feb","Mar","Abr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      }
    };

    this._reqRepHorasTLS= {} as ReqRepHorasTLS;
    this._reqRepAnioTLS ={} as ReqRepanioTLS;
    this._reporteGral =[] as ReporteHorasTLS[];
    this._reporteGralStandBy=[] as ReporteHorasTLS[];
    this._reporteGralOver=[] as ReporteHorasTLS[];
    this.repgralUnit={} as RepGralHoras;
    this.MUser = this.storageData.obtenerDatosMapeados();
   // this.getReqRepAnioTLS();
  }

  isSideNavCoIIapsed = false;
  noSemana: number = 1;
  seriesStandBy:number=0;
  seriesOverTime:number=0;
  noAno: number = 2023;
  screenWidth = 0;
  title="Dashboard";
  mListHorusReport = new MatTableDataSource<any>();
  mListAnioReport = new MatTableDataSource<any>();


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
      //this.getReqRepHorasTLS();
    }
    
  }

  valuechangeAno(newValue:number) {
    
    if (newValue<2023 || newValue<=0 || newValue==null) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención!',
        text:'El número de año deberá ser mayor 2023'
    });
    }else {
      this.noAno = newValue;
      console.log(newValue);
      this.getReqRepAnioTLS();
    }
    
  }

  getReqRepAnioTLS(){
    this._reqRepAnioTLS.anio=this.noAno;
    this._reqRepAnioTLS.usuario=this.MUser.employeeCode.toString();

    try {
      this._apiDashboard.GetReporteAnioTLS(this._reqRepAnioTLS)?.pipe(
        map((dataGraf: any) => {
          if (dataGraf && dataGraf.data) {
            let totHorasanuales = (160*12);
            let totalHorasRespServicioStanBy= 0.0;
            let totalHorasRespServicioOverTime= 0.0;

            dataGraf.data.reportesGral[0].monthTls.forEach((dat: MonthTls)  => {
              totalHorasRespServicioStanBy = totalHorasRespServicioStanBy + dat.totalHoras;
  
            });
            dataGraf.data.reportesGral[1].monthTls.forEach((dat: MonthTls)  => {
              totalHorasRespServicioOverTime = totalHorasRespServicioOverTime + dat.totalHoras;  
            });

            this.seriesStandBy= ((totalHorasRespServicioStanBy/totHorasanuales)*100);
            this.seriesOverTime= ((totalHorasRespServicioOverTime/totHorasanuales)*100);
            
            var options = {
              series: [this.seriesStandBy],
              chart: {
              height: 180,
              type: "radialBar",
              toolbar: {
                  show: true   
                }
              },
              plotOptions: {
              radialBar: {
              startAngle: -100,
              endAngle: 90,
              hollow: {
                margin: 0,
                size: "50%",
                background: "#fff",
                image: undefined,
                position: "front",
                dropShadow: {
                      enabled: true,
                      top: 3,
                      left: 0,
                      blur: 4,
                      opacity: 0.24
                    }
                  },
                  track: {
                    background: "#fff",
                    strokeWidth: "75%",
                    margin: 0, // margin is in pixels
                    dropShadow: {
                       enabled: true,
                       top: -3,
                       left: 0,
                       blur: 4,
                       opacity: 0.35
                     }
                   },
                   dataLabels: {
                    show: true,
                    name: {
                      offsetY: -10,
                      show: true,
                      color: "#888",
                      fontSize: "15px"
                    },
                    value: {
                      formatter: function(val: { toString: () => string; }) {
                        return parseInt(val.toString(), 10).toString();
                      },
                      color: "#111",
                      fontSize: "26px",
                      offsetY:2,
                      show: true
                    }
                  }
                }
              },
              fill: {
                type: "gradient",
                gradient: {
                  shade: "dark",
                  type: "horizontal",
                  shadeIntensity: 0.5,
                  gradientToColors: ["#ABE5A1"],
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100]
                }
              },
              stroke: {
                lineCap: "round"
              },
              labels: ["valor"]
            }
            new ApexCharts(document.querySelector("#GraphSTB"), options).render();

            var options = {
              series: [this.seriesOverTime],
              chart: {
              height: 180,
              type: "radialBar",
              toolbar: {
                  show: true   
                }
              },
              plotOptions: {
              radialBar: {
              startAngle: -100,
              endAngle: 90,
              hollow: {
                margin: 0,
                size: "50%",
                background: "#fff",
                image: undefined,
                position: "front",
                dropShadow: {
                      enabled: true,
                      top: 3,
                      left: 0,
                      blur: 4,
                      opacity: 0.24
                    }
                  },
                  track: {
                    background: "#fff",
                    strokeWidth: "75%",
                    margin: 0, // margin is in pixels
                    dropShadow: {
                       enabled: true,
                       top: -3,
                       left: 0,
                       blur: 4,
                       opacity: 0.35
                     }
                   },
                   dataLabels: {
                    show: true,
                    name: {
                      offsetY: -10,
                      show: true,
                      color: "#888",
                      fontSize: "15px"
                    },
                    value: {
                      formatter: function(val: { toString: () => string; }) {
                        return parseInt(val.toString(), 10).toString();
                      },
                      color: "#111",
                      fontSize: "26px",
                      offsetY:2,
                      show: true
                    }
                  }
                }
              },
              fill: {
                type: "gradient",
                gradient: {
                  shade: "dark",
                  type: "horizontal",
                  shadeIntensity: 0.5,
                  gradientToColors: ["#ABE5A1"],
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100]
                }
              },
              stroke: {
                lineCap: "round"
              },
              labels: ["valor"]
            }
            new ApexCharts(document.querySelector("#GraphOVT"), options).render();
            




            return this.mListAnioReport;
          } else {
    
            return null;
          }
        })
      ).subscribe((dataMapeada: any) => {
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
        (      error: { message: string; }) => {
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

  getReqRepHorasTLS(){
    this._reqRepHorasTLS.semana=this.noSemana;
    this._reqRepHorasTLS.usuario=this.MUser.employeeCode.toString();
    
    
    //this._reqRepHorasTLS.usuario=sessionStorage.getItem("User").toString();

    try {
      this._apiDashboard.GetReporteHorasTLS(this._reqRepHorasTLS)?.pipe(
        map((data: any) => {
          this.datadias=[];
          this._reporteGral=[];
          this.repGralDias=[];
          this.repGralDiasStandBy=[];
          this.repGralDiasOver=[];

          if (data && data.data) {
            this.mListHorusReport=data.data
            this._reporteGral=data.data.reposterGral[0].reportesTLS;
            this._reporteGralStandBy=data.data.reposterGral[1].reportesTLS;
            this._reporteGralOver=data.data.reposterGral[2].reportesTLS;
  
            data.data.reposterGral[0].reportesTLS.forEach((dat: ReporteHorasTLS)  => {
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

            data.data.reposterGral[1].reportesTLS.forEach((dat: ReporteHorasTLS)  => {
              this.repgralUnit={} as RepGralHoras;
              this.repgralUnit.tool = dat.tool;
              this.repgralUnit.dia1=dat.weekDaysTls[0].totalHoras.toString();
              this.repgralUnit.dia2=dat.weekDaysTls[1].totalHoras.toString();
              this.repgralUnit.dia3=dat.weekDaysTls[2].totalHoras.toString();
              this.repgralUnit.dia4=dat.weekDaysTls[3].totalHoras.toString();
              this.repgralUnit.dia5=dat.weekDaysTls[4].totalHoras.toString();
              this.repgralUnit.dia6=dat.weekDaysTls[5].totalHoras.toString();
              this.repgralUnit.dia7=dat.weekDaysTls[6].totalHoras.toString();
              this.repGralDiasStandBy.push(this.repgralUnit);
  
            });

            data.data.reposterGral[2].reportesTLS.forEach((dat: ReporteHorasTLS)  => {
              this.repgralUnit={} as RepGralHoras;
              this.repgralUnit.tool = dat.tool;
              this.repgralUnit.dia1=dat.weekDaysTls[0].totalHoras.toString();
              this.repgralUnit.dia2=dat.weekDaysTls[1].totalHoras.toString();
              this.repgralUnit.dia3=dat.weekDaysTls[2].totalHoras.toString();
              this.repgralUnit.dia4=dat.weekDaysTls[3].totalHoras.toString();
              this.repgralUnit.dia5=dat.weekDaysTls[4].totalHoras.toString();
              this.repgralUnit.dia6=dat.weekDaysTls[5].totalHoras.toString();
              this.repgralUnit.dia7=dat.weekDaysTls[6].totalHoras.toString();
              this.repGralDiasOver.push(this.repgralUnit);
  
            });

            
  
  
            data.data.reposterGral[0].reportesTLS[0].weekDaysTls.forEach((data: WeekDaysTls) => {
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
