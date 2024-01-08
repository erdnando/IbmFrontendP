import {LOCALE_ID, ViewChild} from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { BehaviorSubject, Subject, Subscription, map } from 'rxjs';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { ListCountryService } from 'src/app/AdminViews/AdminCountries/services/list-country/list-country.service';
import { PopupFestivosComponent } from '../popup-festivos/popup-festivos.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MParameters } from 'src/app/Models/MParameters';
import { ApiParameters } from 'src/app/Views/parameters/services/parameters/api.parameters';
import { ParameterConsultService } from 'src/app/Views/parameters/services/parameterConsul/parameter-consult.service';
import { Guid } from 'guid-typescript';
import {
  MatCalendarCellCssClasses,
  MatDatepicker,
} from '@angular/material/datepicker';
import { PopUpCreateParameterComponent } from '../pop-up-create-parameter/pop-up-create-parameter.component';
import Swal from 'sweetalert2';
import { ParameterUpdateService } from 'src/app/Views/parameters/services/parametersUpdate/parameter-update.service';
import { MFestivos } from 'src/app/Models/MFestivos';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { FestivosCreateService } from 'src/app/Views/parameters/services/festivosCreate/festivos-create.service';
import { FestivosDeleteService } from 'src/app/Views/parameters/services/festivosDelete/festivos-delete.service';
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';
import { HorarioCreateService } from 'src/app/Views/parameters/services/horarioCreate/horario-create.service';
import { MCreateHorario } from 'src/app/Models/MHorario';
import { UserConsultByCodeEmService } from 'src/app/Views/user/services/userConsultByCodeEm/user-consult-by-code-em.service';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';
import * as XLSX from 'xlsx';
import { PopUpHorarioComponent } from '../pop-up-horario/pop-up-horario.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTable } from '@angular/material/table';
import { CdkRowDef } from '@angular/cdk/table';




interface MiObjeto {
  [key: string]: any;
}
interface MiObjetoApp {
  [key: string]: any;
}

type Aoa = any[][];

@Component({
  providers: [DatePipe],
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
})

export class ParametersComponent implements OnInit {
  
  // VARIABLES
  MListCountry: MCountryEntity[];
  ExcelData: any;
  ListparametersStand: MParameters[];
  ListparametersOver: MParameters[];
  MParameter: MParameters;
  pais = new FormControl('');
  limitDay = new FormControl('');
  limitWeek = new FormControl('');
  limitMonth = new FormControl('');
  limitYear = new FormControl('');
  botonPresionado: string = 'festividades';
  idParametersStand: string = '';
  idParametersOver: string = '';
  agregarFestivos: boolean = false;
  festivos: [] = [];
  MFestivos: MFestivos;
  MFestivosList: MFestivos[];
  EntityFestivos: MFestivos[];
  suscription: Subscription;
  suscriptionFestivosLocal: Subscription;
  suscriptionFestivosdb: Subscription;
  idCountryGlobal: string = '';
  MUser: any;
  idPaisSeleccionado: string = '';
  nPaisSeleccionado: string = '';
  Approving: boolean = false;
  agregarHorariosexcel: boolean = false;
  name:string = '';
  habilitarExcel: boolean = false;
  fesitvosExcel: any[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
  };

  datosTable:any [] = [];

  campoActivar = false;

  Datos = [
    { day: 'Lunes', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Martes', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Miércoles', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Jueves', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Viernes', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Sábado', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Domingo', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
  ];

  Seasons = [
    { descripcion:'Navidad', diafestivo_DD_MM_YYYY: 'dd/MM/YYYY', pais:'Colombia',ano:'2023' }
  ];

  columnasAMostrar = ['dias', 'inicio','a', 'fin', 'checkbox'];

  @ViewChild(MatTable) tabla1!: MatTable<HorarioNew>;


  constructor(
    private apiListCountry: ListCountryService,
    public dialog: MatDialog,
    private storageFestivos: StorageService,
    private apiParameters: ParameterUpdateService,
    private apiParametersConsult: ParameterConsultService,
    private cdr: ChangeDetectorRef,
    private serviceList: ObtenerlistaService,
    private apiFestivosCreate: FestivosCreateService,
    private apiFestivosDelete: FestivosDeleteService,
    private horarioCreate: HorarioCreateService,
    private consultUserByEmployee: UserConsultByCodeEmService,
    private rutaActual: RutaActualService
  ) {

    
    this.MListCountry = [];
    this.EntityFestivos = [];
    this.MFestivosList = [];
    this.mHorario = {} as MCreateHorario;
    this.MParameter = {} as MParameters;
    this.MFestivos = {} as MFestivos;
    this.suscription = new Subscription();
    this.suscriptionFestivosLocal = new Subscription();
    this.suscriptionFestivosdb = new Subscription();
    this.MUser = this.storageFestivos.obtenerDatosMapeados();
    this.name = 'ExcelSheet.xlsx';

    this.suscriptionFestivosLocal = this.storageFestivos
      .obtenerDiasFestivos()
      .subscribe((festivos) => {
        this.festivos = festivos;
      });

    this.ListparametersStand = [];
    this.ListparametersOver = [];
  }

  ngOnInit(): void {
    this.consultcountries();

    this.suscription = this.storageFestivos.refreshParam$.subscribe((lista) => {
      this.ListparametersStand = [];
      this.ListparametersOver = [];

      for (let item of lista) {
        if (item.typeHours == 0) {
          this.ListparametersStand.push(item);
          this.idParametersStand = item.idParametersEntity;
        } else {
          this.ListparametersOver.push(item);
          this.idParametersOver = item.idParametersEntity;
        }
      }
    });

    this.consultarHorarioEmpleado();

    
  }

  exportToExcel(){

    let element = this.Seasons;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
    console.log(book);
  }

  readFile(fileInput: any) {
    let file = fileInput[0]; // Accede al primer archivo seleccionado

    if (file) {
      let fileReader = new FileReader();

      fileReader.readAsBinaryString(file);

      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary' });
        var sheetNames = workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
        console.log(this.ExcelData);

        // this.loadArpExcelService.PostLoad1(this.ExcelData).subscribe((data: any) => {
        //   console.log(data);
        // });
      }
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }


  eliminarFestivo(festivo: any) {
    this.storageFestivos.eliminarFestivo(festivo);
  }

  eliminarFestivoDB(festivo: any) {

   // this.storageFestivos.eliminarFestivo(festivo);

    this.apiFestivosDelete
    .PostDeleteFestivo(festivo)
    .subscribe((data) => {
      if (data.data) {

        Swal.fire({
          icon: 'success',
          title: 'Acción completada.',
          confirmButtonColor: '#0A6EBD',
        });

        this.suscriptionFestivosdb = this.serviceList
          .loadFestivos(this.pais.value as unknown as string)
          .subscribe((festivo) => {
            festivo.sort((a, b) => new Date(a.diaFestivo).getTime()
              - new Date(b.diaFestivo).getTime());
            this.MFestivosList = festivo;
          });
        this.agregarFestivos = false;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, los datos no se pudieron borrar',
          confirmButtonColor: '#0A6EBD',
        });
      }
    });

  this.storageFestivos.limpiarDiasFestivos();
  this.festivos = [];
  this.EntityFestivos = [];
  this.cdr.detectChanges();

  this.storageFestivos.obtenerDiasFestivos().subscribe((festivos) => {
    this.festivos = festivos;
  });
  }

  // METODO PARA AGREGAR FESTIVOS A LA LISTA
  openDialog() {
    this.agregarFestivos = true;
    this.cdr.detectChanges();
    this.dialog.open(PopupFestivosComponent);
  }

  //confirmacion festivos
  falseAgregarFestivos() {
    for (let festivo of this.storageFestivos.obtenerDiasFestivosAnos()) {
      this.MFestivos = {} as MFestivos;
      this.MFestivos.diaFestivo = festivo[0];
      this.MFestivos.ano = festivo[1];
      this.MFestivos.countryId = this.pais.value as unknown as string;
      this.MFestivos.descripcion = 'Dia Fesitvo';

      this.EntityFestivos.push(this.MFestivos);
    }

    this.apiFestivosCreate
      .PostCreateFestivo(this.EntityFestivos)
      .subscribe((data) => {
        if (data.data) {
          Swal.fire({
            icon: 'success',
            title: 'Creacion completada.',
            confirmButtonColor: '#0A6EBD',
          });
          this.suscriptionFestivosdb = this.serviceList
            .loadFestivos(this.pais.value as unknown as string)
            .subscribe((festivo) => {
              festivo.sort((a, b) => new Date(a.diaFestivo).getTime()
                - new Date(b.diaFestivo).getTime());
              this.MFestivosList = festivo;
            });
          this.agregarFestivos = false;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error, los datos no se pudieron crear, por que ya existe esa fecha registrada',
            confirmButtonColor: '#0A6EBD',
          });
        }
      });

    this.storageFestivos.limpiarDiasFestivos();
    this.festivos = [];
    this.EntityFestivos = [];
    this.cdr.detectChanges();

    this.storageFestivos.obtenerDiasFestivos().subscribe((festivos) => {
      this.festivos = festivos;
    });
  }

  //METODO PARA MOSTRAR LOS FESTIVOS EN EL CALENDARIO
  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      // Aquí puedes definir tus fechas específicas que quieres resaltar
      const highlightDates = ['2023-12-25', '2023-12-31'].map(
        (strDate) => new Date(strDate)
      );
      const highlightDate = highlightDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );
      return highlightDate ? 'special-date' : '';
    };
  }

  reloadParameters(_idCountry:string){
   // this.cdr.detectChanges();

    this.agregarFestivos = false;
    

    if (this.pais.value !== null) {
      this.codeEmployed.reset();
      this.date.reset();
      this.mHorarioList = []
      this.habilitarHorario = false;
      this.habilitarHorariobyFecha = false;
      this.habilitarExcel = true
      this.idCountryGlobal = _idCountry;
      let idCountry: string = _idCountry;
      let guidIdCountry: Guid = Guid.parse(idCountry);
      this.apiParametersConsult
        .GetParametersConsult(guidIdCountry)
        .pipe(map((data: MiObjetoApp) => data))
        .subscribe((data) => {
          let listap = data['data'];

          if (this.pais.value !== '') {
            this.suscriptionFestivosdb = this.serviceList
              .loadFestivos(this.pais.value as unknown as string)
              .subscribe((festivo) => {
                festivo.sort((a, b) => new Date(a.diaFestivo).getTime()
                  - new Date(b.diaFestivo).getTime());
                this.MFestivosList = festivo;
              });
          }
 
          this.ListparametersStand = [];
          this.ListparametersOver = [];

          for (let item of listap) {
            if (item.typeHours == 0) {
              this.ListparametersStand.push(item);
              this.idParametersStand = item.idParametersEntity;
            } else {
              this.ListparametersOver.push(item);
              this.idParametersOver = item.idParametersEntity;
            }
          }
        });
    } else {
    }
  }
    
  

  select(plan: any) {
    this.cdr.detectChanges();

    this.agregarFestivos = false;
    

    if (this.pais.value !== null) {
      this.codeEmployed.reset();
      this.date.reset();
      this.mHorarioList = []
      this.habilitarHorario = false;
      this.habilitarHorariobyFecha = false;
      this.habilitarExcel = true
      this.idCountryGlobal = plan.value;
      let idCountry: string = plan.value;
      let guidIdCountry: Guid = Guid.parse(idCountry);
      this.apiParametersConsult
        .GetParametersConsult(guidIdCountry)
        .pipe(map((data: MiObjetoApp) => data))
        .subscribe((data) => {
          let listap = data['data'];

          if (this.pais.value !== '') {
            this.suscriptionFestivosdb = this.serviceList
              .loadFestivos(this.pais.value as unknown as string)
              .subscribe((festivo) => {
                festivo.sort((a, b) => new Date(a.diaFestivo).getTime()
                  - new Date(b.diaFestivo).getTime());
                this.MFestivosList = festivo;
              });
          }
 
          this.ListparametersStand = [];
          this.ListparametersOver = [];

          for (let item of listap) {
            if (item.typeHours == 0) {
              this.ListparametersStand.push(item);
              this.idParametersStand = item.idParametersEntity;
            } else {
              this.ListparametersOver.push(item);
              this.idParametersOver = item.idParametersEntity;
            }
          }
        });
    } else {
    }
  }

  CommaFormatted(event: { which: number; }) {
    // skip for arrow keys
    if(event.which >= 37 && event.which <= 40) return;
   
    // format number
    if (this.limitWeek) {
      let aux = this.limitWeek.value!.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
     this.limitWeek.setValue(aux);
    }}
   
   numberCheck (args: { key: string; }) {
   if (args.key === 'e' || args.key === '+' || args.key === '-') {
     return false;
   } else {
     return true;
   }
  }

  formatComma(n: string) {
    console.log(n);
    if(!isNaN(Number(n))) return Number(n);

    'use strict';
    n = n.replace(/\./g, '').replace(',', '.');
    console.log(n);
    return Number(n);
}

  ngOnChanges(changes: any) {
        
   // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values
    
}

  // METODO ACTULIZAR HORAS PARAMETROS
  updateParameters() {
    if (this.pais.value !== null) {
      if (this.botonPresionado == 'standby') {
        this.MParameter.idParametersEntity = this
          .idParametersStand as unknown as Guid;
        this.MParameter.typeHours = 0;
      } else {
        this.MParameter.idParametersEntity = this
          .idParametersOver as unknown as Guid;
        this.MParameter.typeHours = 1;
      }

      this.MParameter.countryEntityId = this.pais.value as unknown as Guid;
      this.MParameter.targetTimeDay = Number(this.limitDay.value);
      this.MParameter.targetHourWeek = Number(this.formatComma(this.limitWeek.value!));
      this.MParameter.targetHourMonth = Number(this.formatComma(this.limitMonth.value!));
      this.MParameter.targetHourYear = Number(this.formatComma(this.limitYear.value!));
      this.MParameter.typeLimits = 0;

      this.apiParameters
        .PostUpdateParameter(this.MParameter)
        .subscribe((data) => {
          if (data.data) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizacion completada correctamente.',
              confirmButtonColor: '#0A6EBD',
            });

            //reload form
           this.reloadParameters(this.MParameter.countryEntityId.toString());

            //---------------------------------
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error, los datos no se pudieron cambiar',
              confirmButtonColor: '#0A6EBD',
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Primero debe seleccionar un pais.',
        confirmButtonColor: '#0A6EBD',
      });
    }
  }

  // METODO CREACION DEL PARAMETRO HORAS DESDE UNA VENTANA MODAL
  crearParametro() {
    if (this.pais.value !== '') {
      this.dialog.open(PopUpCreateParameterComponent, {
        data: {
          // Aquí puedes agregar los datos que quieras enviar
          idCountry: this.pais.value,
          tipoHora: this.botonPresionado,
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Primero debe seleccionar un pais.',
        confirmButtonColor: '#0A6EBD',
      });
    }
  }

  // Filtro Horarios

  habilitarHorario = false;
  habilitarHorariobyFecha = false;

  paisRutaActual = this.rutaActual.globalVar;

  idUserByEmployeCode: string = '';

  applyFilter(event: any) {
    let codeEmploye = (event.target as HTMLInputElement).value;
    this.consultUserByEmployee
      .GetUserEmployeCode(codeEmploye, this.pais.value!)
      .pipe(map((data: any) => data))
      .subscribe((data) => {
        if (data.data !== '00000000-0000-0000-0000-000000000000') {
          this.idUserByEmployeCode = data.data;
          this.habilitarHorario = true;
          if(this.habilitarHorariobyFecha && this.habilitarHorario){
            this.consultarHorarioEmpleado();
          }
        } else {
          this.habilitarHorario = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario no existe.',
            confirmButtonColor: '#0A6EBD',
          });
        }
      });
  }

  // DATOS HORARIO

  horaInicio = new FormControl('');
  horaFin = new FormControl('');
  valoresInicio: { [dia: string]: string[] } = {};
  mHorario: MCreateHorario;
  mHorarioList: MCreateHorario[] = [];
  mHorarioListExcel: MCreateHorario[] = [];
  mHoraioConsult: MCreateHorario[] = [];
  semanaAno: string = '';

  guardarValorInicio(dia: any[]) {
    //this.valoresInicio[dia] = [this.horaInicio.value!,this.horaFin.value!];
    if (dia.length === 0) {
      throw new Error('La lista está vacía');
    }

    if(dia.length === 1){
      console.log('este el el primer lengt', dia)
      this.mHorario = {
        horaInicio: this.horaInicio.value as string,
        horaFin: this.horaFin.value as string,
        week: this.semanaAno,
        userEntityId: this.idUserByEmployeCode,
        day: dia[0],
        ano: this.fechaSemanaAno
      };
      let index = this.mHorarioList.findIndex(
        (mHorario) => mHorario.day === this.mHorario.day
      );
  
      if (index !== -1) {
        this.mHorarioList[index] = this.mHorario;
      } else {
        this.mHorarioList.push(this.mHorario);
      }
    }
    else if(dia.length > 1){
      for(let x of dia){
        this.mHorario= {
          horaInicio:  this.convertirHoraAMPMa24(x.horaInicio) as string,
          horaFin: this.convertirHoraAMPMa24(x.horaFin) as string,
          week: this.semanaAno,
          userEntityId: this.idUserByEmployeCode,
          day: x.day,
          ano: this.fechaSemanaAno 
        }; 
        console.log(x.horaFin, this.convertirHoraAMPMa24(x.horaFin), 'conversion' )
        let index = this.mHorarioList.findIndex(
          (mHorario) => mHorario.day === this.mHorario.day
        );
    
        if (index !== -1) {
          this.mHorarioList[index] = this.mHorario;
          this.mHorarioListExcel[index] = this.mHorario;
        } else {
          this.mHorarioList
          this.mHorarioListExcel.push(this.mHorario);
        }
      }  
      console.log(this.mHorarioList)
      console.log(this.mHorario,' esta es la lista del excel')    
    }

  }

  codeEmployed = new FormControl("");
  date = new FormControl(null);
  fechaSemanaAno: string = "";

  onDateChange(event: any) {

    function getWeek(date: Date): number {
      let onejan = new Date(date.getFullYear(), 0, 1);
      return Math.ceil(
        ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) /
          7
      );
    }

    let date = new Date(this.date.value as unknown as Date);
    let year = date.getFullYear().toString();
    let week = getWeek(date);
    this.semanaAno = week.toString();
    this.fechaSemanaAno = year;
    console.log(this.fechaSemanaAno,' ano ', this.semanaAno, ' semana')
    this.habilitarHorariobyFecha = true;

    if(this.habilitarHorariobyFecha && this.habilitarHorario){
      this.consultarHorarioEmpleado();
    }
  }

  crearHorario() {
    this. mHorarioList = this.mHorarioList.
    filter(horario => horario.horaInicio !== '' && horario.horaFin !== '');

    console.log(this.mHorarioList, 'esto es lo que se envia en la creacion')

    console.log(this.mHorarioList);
    if(this.mHorarioList.length){
      this.horarioCreate
      .PostCreateHorario(this.mHorarioList)
      .subscribe((data) => {
        if (data.data) {
          Swal.fire({
            icon: 'success',
           title: 'Creacion  completada correctamente.',
           confirmButtonColor: '#0A6EBD',
         });
         this.resetEditable();
         this.agregarHorariosexcel = false;
         this.habilitarHorario = false;
         this.codeEmployed.reset();
         this.horaFin.reset();
         this.horaInicio.reset();
         this.date.reset();
         this.mHorarioList = [];
       } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error, los datos no se pudieron cargar',
            confirmButtonColor: '#0A6EBD',
          });
        }
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Primero debe registrar un horario',
        confirmButtonColor: '#0A6EBD',
      });
    }
    
  }


  // Consultar Horario empleado

  
 
  consultarHorarioEmpleado(){
    this.cdr.detectChanges();
    this.mHorarioListExcel=[];
    let pais= this.storageFestivos.obtenerDatosMapeados();
  
    if(this.habilitarHorariobyFecha && this.habilitarHorario){
      this.serviceList.loadHorarios(this.idUserByEmployeCode, this.semanaAno, this.fechaSemanaAno).subscribe(horario => {
        horario.forEach(element => {
          let rowseasona ={
            day: element.day, 
            horaInicio: element.horaInicio, 
            horaFin: element.horaFin,
            userEntityId: element.userEntityId,
            week: element.week,
            ano: element.ano
          };

          let index = this.mHorarioListExcel.findIndex(
            (mHorario) => mHorario.day === element.day
          );
      
          if (index !== -1) {
            this.mHorarioListExcel[index] = rowseasona;
          } else {
            this.mHorarioListExcel.push(rowseasona);
          }
        });
        
        console.log(horario,  'lista de horarios');
        if(horario.length >= 1){
          this.habilitarHorariobyFecha = false;
          setTimeout(() => {
            this.openDialogHorario(horario);
          }, 3);
        }
     
      });
    }
  }

  openDialogHorario(horario: any[]) {
    console.log('esto es open dialog de horario ')
    this.dialog.open(PopUpHorarioComponent, {
      data: {
        horario: horario,
      },
    });
  }
  
  consultcountries() {
    // SERVICIO PARA TRAER LA LISTA DE PAISES
    this.apiListCountry
      .GetCountry().pipe(map((data: MiObjeto) => data)).subscribe((data) => {
        let lista = data['data'];

        let MListCountryFilter = lista.filter((x: any) => x.idCounty == this.MUser.countryEntityId);
        console.log('Rol',this.MUser.rolEntity.nameRole);

        if (this.MUser.rolEntity.nameRole == 'Super Administrador') {
          this.MListCountry = lista;
          this.Approving = true;

        }else if (this.MUser.rolEntity.nameRole == 'Administrador') {
          this.MListCountry = MListCountryFilter;
          this.Approving = true;

        }else{
          this.Approving = false
        }
      });
  }


  ngOnDestroy() {
    this.suscription.unsubscribe();
    this.suscriptionFestivosLocal.unsubscribe();
    this.suscriptionFestivosdb.unsubscribe();
  }


  excelDateToJSDate(serial: any) {
    let utc_days  = Math.floor(serial - 25569);
    let utc_value = utc_days * 86400;                                        
    let date_info = new Date(utc_value * 1000);
 
    let year = date_info.getUTCFullYear();
    let month = date_info.getUTCMonth() + 1;
    let day = date_info.getUTCDate();
 
    let dayStr = day < 10 ? '0' + day.toString() : day.toString();
    let monthStr = month < 10 ? '0' + month.toString() : month.toString();
 
    return `${year}-${monthStr}-${dayStr}`;

 }


  cargarArchivo() {
    let elemento = document.getElementById('input-excel');
    if(elemento) {
      elemento.click();
      this.agregarFestivos = true;
    } else {
      console.log("No se encontró el elemento con id 'input-excel'");
    }
  }

  //subir plantilla
  manejarArchivo(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length == 0) throw new Error('No ha seleccionado ningun archivo');
    if (target.files.length !== 1) throw new Error('No se puede cargar múltiples archivos');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* leer el contenido del archivo */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      /* Obtén el primer nombre de la hoja de cálculo */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* Guarda los datos en un array */
      const data = <Aoa>(XLSX.utils.sheet_to_json(ws, {header: 1,raw: true,dateNF:'yyyy-mm-dd'}));
      /* Convierte el array a una lista de objetos */
      const listaObjetos = data.slice(1).map(row => {
        console.log('Fila:', row);  
        return {
          descripcion: row[0],
          diafestivo_DD_MM_YYYY: this.excelDateToJSDate(row[1]),
          pais: row[2],
          ano: row[3].toString(),
        };
      });
      this.guardarFestivosExcel(listaObjetos);      
      console.log(listaObjetos);
      event.target.value = '';      //setea el evento para poder sellecionar nuvamente archivos 
    };
  
    reader.readAsBinaryString(target.files[0]);
  }

  guardarFestivosExcel(lista: any[]){
    for (let list of lista){
      let listaFestivos = [];
      listaFestivos.push(list.diafestivo_DD_MM_YYYY,list.ano)
      console.log(list.diafestivo_DD_MM_YYYY, 'esta es la lista')
      this.storageFestivos.guardarDiasFestivos(listaFestivos);
    }
    
  }

  exportToExcelHours(){

    let name = "Plantilla_Horarios.xlsx";
    let pais= this.storageFestivos.obtenerDatosMapeados();
    let season: any[] =[];
    this.mHorarioListExcel.forEach(element => {
      let rowseason ={
        dia: element.day, 
        horaInicio: element.horaInicio, 
        horaFin: element.horaFin,
        codigo_Empleado: element.userEntityId, 
        pais: pais.countryEntity.nameCountry
      };
      season.push(rowseason);
    });
    // season = [
    //   { 
    //     dia: 'Lunes', 
    //     horaInicio: '00:00', 
    //     horaFin: '00:00',
    //     fecha: 'dd/MM/YYYY', 
    //     codigo_Empleado: '255', 
    //     pais: pais.countryEntity.nameCountry
    //   },
    //   { 
    //     dia: 'Martes', 
    //     horaInicio: '00:00', 
    //     horaFin: '00:00' 
    //   },
    //   { 
    //     dia: 'Miércoles', 
    //     horaInicio: '00:00', 
    //     horaFin: '00:00' 
    //   },
    //   { 
    //     dia: 'Jueves', 
    //     horaInicio: '00:00', 
    //     horaFin: '00:00' 
    //   },
    //   { 
    //     dia: 'Viernes',
    //     horaInicio: '00:00', 
    //     horaFin: '00:00' 
    //   },
    // ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(season);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, name);
    console.log(book);
  }

  convertirHoraAMPMa24(hora: string): string {
  
    let partes = hora.match(/(\d+):(\d+) (\w+)/);
    let horas = Number(partes![1]);
    let minutos = Number(partes![2]);
    let ampm = partes![3];
  
    if (ampm === 'p' && horas < 12) {
      horas = horas + 12;
    } else if (ampm === 'a' && horas === 12) {
      horas = 0;
    }
  
    return ('0' + horas).slice(-2) + ':' + ('0' + minutos).slice(-2);
  }

  excelHourToAMPM(hora: any) {
    // Convierte la hora de Excel a una fracción del día
    let dayFraction = hora - Math.floor(hora);
  
    // Convierte la fracción del día a milisegundos
    let milliseconds = dayFraction * 24 * 60 * 60 * 1000;
  
    // Crea una nueva fecha a partir de los milisegundos
    let date = new Date(milliseconds);
  
    // Ajusta la hora para tener en cuenta la diferencia de zona horaria
    let timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
    date = new Date(date.getTime() + timezoneOffset);
  
    // Formatea la fecha a una cadena en formato AM/PM
    let options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    let timeString = date.toLocaleTimeString(undefined, options);
  
    return timeString;
}

  cargarArchivoHorarios() {
    let elemento = document.getElementById('input-excel');
    if(elemento) {
      elemento.click();
      this.agregarHorariosexcel = true;
    } else {
      console.log("No se encontró el elemento con id 'input-excel'");
    }
  }

  diasdelHorarios: any[] =[];

  manejarArchivoHorarios(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length == 0) throw new Error('No ha seleccionado ningun archivo');
    if (target.files.length !== 1) throw new Error('No se puede cargar múltiples archivos');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = <Aoa>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      const listaObjetos = data.slice(1).map(row => {
        if (row.length !== 0) {
          console.log('Fila:', row);  
          return {
            day: row[0],
            horaInicio: this.excelHourToAMPM(row[1]),
            horaFin: this.excelHourToAMPM(row[2]),
          };
        }else{
          return false
        }
      }).filter(Boolean);
      this.guardarValorInicio(listaObjetos) ;
      this.diasdelHorarios=listaObjetos;
      console.log(listaObjetos);
      event.target.value = '';      // Setea el evento para poder seleccionar nuvamente archivos 
    };
  
    reader.readAsBinaryString(target.files[0]);
  }


  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
        this.botonPresionado = 'festividades';
    }
    if (event.index === 1) {
      this.botonPresionado = 'overtime';
  }
  if (event.index === 2) {
    this.botonPresionado = 'standby';
}
if (event.index === 3) {
  this.botonPresionado = 'horarios';
}
    
}

resetEditable() {
  this.Datos.forEach(dato => {
    dato.editable = false;
  });
}
  

}

export class HorarioNew {
  constructor(public day: string, public horaInicio: string, public horaFin: string, public editable:boolean=false) {
  }
}
