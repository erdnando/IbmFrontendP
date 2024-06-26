import { AfterViewInit, Component, HostListener, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MonthTls, ReporteHorasMesTLS, ReqRepHorasTLS, ReqRepanioTLS } from "src/app/Models/MReporteHorasTLS";
import { ReporteHorasTLS } from "src/app/Models/MReporteHorasTLS";
import { WeekDaysTls } from "src/app/Models/MReporteHorasTLS";
import { RepGralHoras } from "src/app/Models/MReporteHorasTLS";
import { ApiDashboard } from 'src/app/Views/Dashboard/services/api.Dashboard';
import { MatTableDataSource } from '@angular/material/table';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { Observable, debounceTime, map } from 'rxjs';
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
import { ApiLogin } from '../Login/services/login/api.login';
import { MLogin } from 'src/app/Models/MLogin';
import { FormControl } from '@angular/forms';

export type ChartOptions = {
  id: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

export type ChartOptionsGauge = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
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
export class DashboardComponent implements AfterViewInit {

  @ViewChild("chartStandBy") chartStandBy!: ChartComponent;
  @ViewChild("chartOvertime") chartOvertime!: ChartComponent;
 

  public chartOptions: Partial<ChartOptions>;
  public chartOptionsOvertime: Partial<ChartOptions>;
  public chartOptionsG1: Partial<ChartOptionsGauge>;
  public chartOptionsG2: Partial<ChartOptionsGauge>;

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
 // Userlogin : MLogin;
  employeeCode = '';
  employeeCodeFormControl = new FormControl();

  constructor(private storageData: StorageService, private router: Router,private _apiDashboard:ApiDashboard) {

    this.chartOptions = {
      id:"uno",
      series: [
        {
          name: "Mi serie",
          data: [0,0,0,0,0,0,0,0,0,0,0,0]
        }
      ],
      chart:{
        height:230,
        /* width:700, */
        type:"bar",
        redrawOnWindowResize: true,
        redrawOnParentResize: true,
      },
      title:{
        text:"Stand By"
      },
      xaxis:{
        categories:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
      }
    };

    this.chartOptionsOvertime = {
      id:"dos",
      series: [
        {
          name: "Mi serie",
          data: [0,0,0,0,0,0,0,0,0,0,0,0]
        }
      ],
      chart:{
        height:230,
        /* width:700, */
        type:"bar",
        redrawOnWindowResize: true,
        redrawOnParentResize: true,
      },
      title:{
        text:"Over Time"
      },
      xaxis:{
        categories:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
      }
    };

    this.chartOptionsG1 = {
      series: [0],
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
              formatter: function(val) {
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
    };

    this.chartOptionsG2 = {
      series: [0],
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
              formatter: function(val) {
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
    };

    this._reqRepHorasTLS= {} as ReqRepHorasTLS;
    this._reqRepAnioTLS ={} as ReqRepanioTLS;
    this._reporteGral =[] as ReporteHorasTLS[];
    this._reporteGralStandBy=[] as ReporteHorasTLS[];
    this._reporteGralOver=[] as ReporteHorasTLS[];
    this.repgralUnit={} as RepGralHoras;

   console.log("=================Leyendo datos usuario from storage en constructor del dashboard=============");
    this.MUser = this.storageData.obtenerDatosMapeados();
    console.log(this.MUser);
   // this.getReqRepAnioTLS();
   //this.seriesStandBy=0;
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
   
    console.log("=================Leyendo datos usuario from storage en dashboard=============");
    this.MUser = this.storageData.obtenerDatosMapeados();
    console.log(this.MUser);
    if(this.MUser==null){

      /*Swal.fire({
        icon: 'error',
        title: 'No se han podido obtener datos de su login. Por favor reportelo con el administrador',
        confirmButtonColor: '#0A6EBD',
      });*/
      return;
    }else{

    this.employeeCode = this.MUser.employeeCode;
    this.employeeCodeFormControl = new FormControl(this.employeeCode, []);
    this.noAno=this.currentDate.getFullYear();
    let startDate = new Date(this.currentDate.getFullYear(), 0, 1);
    let days = Math.floor((Number(this.currentDate) - Number(startDate)) /(24 * 60 * 60 * 1000));
    this.noSemana = Math.ceil(days / 7);

    this.valuechangeAno(this.noAno)
    this.getReqRepHorasTLS();
    
    this.dtOptions={
      pagingType:'full_numbers',
      resposive:true,

    };

    
     setTimeout(() => {
      this.resizeChart(window.innerWidth);
      }, 100);

    }

    this.employeeCodeFormControl.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      if (value) {
        this.onEmployeeCodeChange(value);
      }
    });
  
  
  }

  ngAfterViewInit() {
    setTimeout(()=> {
      console.log('window inner width', window.innerWidth);
      this.resizeChart(window.innerWidth);
      
    }, 100);
  }

 

  valuechange(newValue:number) {
    
    if (newValue>52 || newValue<=0 || newValue==null) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención!',
        text:'El número de semana deberá estar entre 1 y 52',
        confirmButtonColor: '#0A6EBD',
        });
    }else {
      this.noSemana = newValue;
      console.log(newValue);
      if (this.employeeCode) {
        this.getReqRepHorasTLS();
      }
    }
    
  }

  onEmployeeCodeChange(employeeCode: string) {
    this.employeeCode = employeeCode;
    if (this.employeeCode) {
      this.getReqRepAnioTLS();
      this.getReqRepHorasTLS();
    }
  }

  valuechangeAno(newValue:number) {
    
    if (newValue<2023 || newValue<=0 || newValue==null) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención!',
        text:'El número de año deberá ser mayor 2023',
        confirmButtonColor: '#0A6EBD',
    });
    }else {
      
      this.noAno = newValue;
      console.log(newValue);
      //this.getReqRepAnioTLS();
      
      setTimeout(() => {
        if (this.employeeCode) {
          this.getReqRepAnioTLS();
        }
      }, 1000);
      
    }
    
  }

  getReqRepAnioTLS(){
   
//if(this.MUser==null)return;
    try {
      this._reqRepAnioTLS.anio=this.noAno;
      this._reqRepAnioTLS.usuario=this.employeeCode.toString();



      this._apiDashboard.GetReporteAnioTLS(this._reqRepAnioTLS)?.pipe(
        map((dataGraf: any) => {
          if (dataGraf && dataGraf.data) {
            let totHorasanuales = (160*12);
            let totalHorasRespServicioStanBy= 0.0;
            let totalHorasRespServicioOverTime= 0.0;
            let arrMonthsStandBy: number[]=[];
            let arrMonthsOverTime: number[]=[];

            dataGraf.data.reportesGral[0].monthTls.forEach((dat: MonthTls)  => {
              totalHorasRespServicioStanBy = totalHorasRespServicioStanBy + dat.totalHoras;
              arrMonthsStandBy.push( parseFloat(dat.totalHoras.toFixed(2)));
  
            });
            dataGraf.data.reportesGral[1].monthTls.forEach((dat: MonthTls)  => {
              totalHorasRespServicioOverTime = totalHorasRespServicioOverTime + dat.totalHoras; 
              arrMonthsOverTime.push( parseFloat(dat.totalHoras.toFixed(2)) ); 
            });

            //testing data
            //this.seriesStandBy=268;// ((totalHorasRespServicioStanBy/totHorasanuales)*100);
            //this.seriesOverTime=256;// ((totalHorasRespServicioOverTime/totHorasanuales)*100);
            //arrMonthsStandBy=[8,8,16,16,24,40,36,24,24,8,40,40]; //arrMonthsStandBy
            //arrMonthsOverTime=[8,8,16,40,40,40,40,16,16,16,8,8]; //arrMonthsOverTime
            
            //from API
           // var standbyM=((totalHorasRespServicioStanBy/totHorasanuales)*100);
            //var overtimeM=((totalHorasRespServicioOverTime/totHorasanuales)*100);
            var standbyM=totalHorasRespServicioStanBy;
            var overtimeM=totalHorasRespServicioOverTime;

            this.seriesStandBy= parseFloat(standbyM.toFixed(2));// parseInt(standbyM.toFixed(2));
            this.seriesOverTime=  parseFloat(overtimeM.toFixed(2));//parseInt(standbyM.toFixed(2));
          
            arrMonthsStandBy= arrMonthsStandBy
            arrMonthsOverTime=arrMonthsOverTime
            //------------------------------------------------------------------------------------
            this.chartOptions = {
              id:"uno",
              series: [
                {
                name: "Mi serie",
                data: arrMonthsStandBy
                }
              ],
              chart: {
                height: 230,
                 width:1000, 
                type: "bar",
                toolbar: {
                    show: true   
                },
                redrawOnWindowResize: true,
                redrawOnParentResize: true,
              },
              title:{
                text:"Stand By"
              },
              xaxis:{
                categories:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
              }
            }
            //----------------------------------------------------------------------------------------        
            //gauge seriesStandBy
            this.chartOptionsG1 = {
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
                      formatter: function(val) {
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
            };
            //--------------------------------------------------------------------------

            this.chartOptionsOvertime = {
              id:"dos",
              series: [
                {
                name: "Mi serie",
                data: arrMonthsOverTime
                }
              ],
              chart: {
                height: 230,
                width:1000, 
                type: "bar",
                toolbar: {
                  show: true   
                },
                redrawOnWindowResize: true,
                redrawOnParentResize: true,
              },
              title:{
                text:"Over Time"
              },
              xaxis:{
                categories:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
              }
            }
            //gauge seriesOverTime
             this.chartOptionsG2 = {
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
                      formatter: function(val) {
                        console.log('val::::::');
                        console.log(val);
                        return parseInt(  (val).toString()).toString();
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
            };

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
          //   confirmButtonColor: '#0A6EBD',
          // });
          
          
        } else {
          // Swal.fire({
          //   icon: 'error',
          //   title: 'Oops...',
          //   text: 'Error en el inicio de sesión, correo o contraseña incorrectos.',
          //   confirmButtonColor: '#0A6EBD',
          // });
        }
      },
        (      error: { message: string; }) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al llamar la API: ' + error.message,
          confirmButtonColor: '#0A6EBD',
        });
      })      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error ' + error,
        confirmButtonColor: '#0A6EBD',
      });
    }  
  }

  getDia(fecha: string){

    try{
      let date = new Date(fecha);
      let day = date.toLocaleString('es-mx', {weekday: 'long'});
      return day;
    }catch(e){
      return "";
    }
    
  }
  getReqRepHorasTLS(){
    //if(this.MUser==null)return;

    this._reqRepHorasTLS.semana=this.noSemana;
    this._reqRepHorasTLS.usuario=this.employeeCode.toString();
    this._reqRepHorasTLS.anio=this.noAno;
    
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
          confirmButtonColor: '#0A6EBD',
        });
      })      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error ' + error,
        confirmButtonColor: '#0A6EBD',
      });
    }  
  }


  onToggleSideNav(data: SideNavTogg1e){
    this.screenWidth = data.screenWidth;
    this.isSideNavCoIIapsed = data.collapsed;
  }

  resizeChart(width: number) {
    console.log(width);
    const maxWidth = 1200;
    this.chartOptions.chart!.width = Math.max(width - 180, 0);
    this.chartOptions.chart!.width = this.chartOptions.chart!.width > maxWidth? maxWidth : this.chartOptions.chart!.width;
    this.chartOptionsOvertime.chart!.width = Math.max(width - 180, 0);
    this.chartOptionsOvertime.chart!.width = this.chartOptionsOvertime.chart!.width > maxWidth? maxWidth : this.chartOptionsOvertime.chart!.width;
    this.chartStandBy.updateOptions(this.chartOptions);
    this.chartOvertime.updateOptions(this.chartOptionsOvertime);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeChart(event.target.innerWidth);
  }
}
