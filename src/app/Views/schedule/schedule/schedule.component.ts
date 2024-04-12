import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpScheduleUpdateComponent } from '../pop-up-schedule-update/pop-up-schedule-update.component';
import { PopUpScheduleCreateComponent } from '../pop-up-schedule-create/pop-up-schedule-create.component';
import { ApproverListService } from 'src/app/AdminViews/AdminApprover/services/approverList/approver-list.service';
import { MAprobador } from 'src/app/Models/MAprobador';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MatTableModule } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MFestivos } from 'src/app/Models/MFestivos';
import { Subscription, map } from 'rxjs';
import { MParameters } from 'src/app/Models/MParameters';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { MCreateHorario } from 'src/app/Models/MHorario';
import { ParameterUpdateService } from '../../parameters/services/parametersUpdate/parameter-update.service';
import { ParameterConsultService } from '../../parameters/services/parameterConsul/parameter-consult.service';
import { Guid } from 'guid-typescript';
import { RutaActualService } from 'src/app/Service/rutaActual/ruta-actual.service';
import { ListCountryService } from 'src/app/AdminViews/AdminCountries/services/list-country/list-country.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as XLSX from 'xlsx';
import { PopUpHorarioComponent } from '../../pop-up-horario/pop-up-horario.component';
import Swal from 'sweetalert2';
import { HorarioCreateService } from '../../parameters/services/horarioCreate/horario-create.service';
import { UserConsultByCodeEmService } from '../../user/services/userConsultByCodeEm/user-consult-by-code-em.service';
import { Time } from '@angular/common';
import { LoadArpExcelService } from 'src/app/AdminViews/ImportExcel/services/LoadArpExcel/LoadArpExcel.service';
import { ScheduleService } from 'src/app/Service/schedule/schedule.service';

interface MiObjeto {
  [key: string]: any;
}
interface MiObjetoApp {
  [key: string]: any;
}

type Aoa = any[][];

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {

  @ViewChild('fileInputHorario') fileInputHorario: any;
  @ViewChild('downloadTemplateEl') downloadTemplateEl: any;
  
  Datos = [
    { day: 'Domingo', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Lunes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Martes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Miércoles', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Jueves', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Viernes', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Sábado', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
  ];
  
  columnasAMostrar = ['dias', 'inicio','a', 'fin', 'checkbox'];
  
  
  MApprover: MAprobador[];
  a : MAprobador[];
  MUser: any;
  columnasexcel:string[]=["#", "NOMBRE DIA", "HORA INICIO", "HORA FIN", "FECHA", "CODIGO EMP", "PAIS"];

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
  idPaisSeleccionado: string = '';
  nPaisSeleccionado: string = '';
  Approving: boolean = false;
  agregarHorariosexcel: boolean = false;
  name:string = '';
  habilitarExcel: boolean = false;
  fesitvosExcel: any[] = [];
  event:string[]=[];

  horaInicio = new FormControl('');
  horaFin = new FormControl('');
  valoresInicio: { [dia: string]: string[] } = {};
  mHorario: MCreateHorario;
  mHorarioList: MCreateHorario[] = [];
  mHorarioListExcel: MCreateHorario[] = [];
  mHoraioConsult: MCreateHorario[] = [];
  semanaAno: string = '';

  habilitarHorario = false;
  habilitarHorariobyFecha = false;

  paisRutaActual = this.rutaActual.globalVar;

  idUserByEmployeCode: string = '';

  codeEmployed = new FormControl("");
  date = new FormControl(null);
  fechaSemanaAno: string = "";

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
  };

  datosTable:any [] = [];
  week1:any[] = [];
  diasdelHorarios: any[] =[];

  confirmedControl = new FormControl(false);
  
  constructor(
    public dialog: MatDialog, 
    private serviceLists: ObtenerlistaService,
    private storageService: StorageService, 
    private storageFestivos: StorageService,
    private apiParameters: ParameterUpdateService,
    private apiParametersConsult: ParameterConsultService,
    private serviceList: ObtenerlistaService,
    private rutaActual: RutaActualService,
    private cdr: ChangeDetectorRef,
    private apiListCountry: ListCountryService,
    private horarioCreate: HorarioCreateService,
    private consultUserByEmployee: UserConsultByCodeEmService,
    private loadArpExcelService: LoadArpExcelService,
    private scheduleService: ScheduleService,
  ) {
    this.MApprover = [];
    this.a = [];

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
  
  openDialog(id: string, name: string, nivel: any) {
    this.dialog.open(PopUpScheduleUpdateComponent,{
      data: {
        // Aquí puedes agregar los datos que quieras enviar
        idApprover: id,
        descripcion: name,
        nivel: nivel
      }
      });
  }

  crearUsuario() {
    this.dialog.open(PopUpScheduleCreateComponent);
  }

  ngOnInit():void{
    this.consultcountries();

    /* this.serviceLists.loadApprovers().subscribe((approvers) => {
      this.MApprover = approvers;
    console.log(this.MApprover);
    console.log(typeof ((this.MApprover[0]).idAprobador) + " verificacion")
    });

    this.serviceLists.refreshApprovers$.subscribe((lista) => {
      this.MApprover= lista;
    }); */

    /* this.validateRole(); */
      this.consultarHorarioEmpleado();
      this.selectAux(this.MUser.countryEntityId);
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
  
          }else if (this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2') {
            this.MListCountry = lista;
            this.Approving = true;
  
          }else if (this.MUser.rolEntity.nameRole == 'Usuario Aprobador N1') {
            this.MListCountry = lista;
            this.Approving = true;
  
          }else{
            this.Approving = false
          }
        });
  
    
    }

    validateRole(){
      if (this.MUser.rolEntity.nameRole == 'Administrador'||this.MUser.rolEntity.nameRole =='Super Administrador') {
        this.Approving = true;
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

    validateHorarios () {
      for (let horario of this.mHorarioList) {
        if (!this.validateHorario(horario.day, horario.horaInicio, horario.horaFin)) return false;
      }
      return true;
    }
  
    validateHorario(day: string, horaInicio: string, horaFin: string) {
      let startDate = new Date();
      const [startHour, startMinutes] = horaInicio.split(":");
      startDate.setHours(+startHour, +startMinutes, 0);
      let endDate = new Date();
      const [endHour, endMinutes] = horaFin.split(":");
      endDate.setHours(+endHour, +endMinutes, 0);
      if(startDate >= endDate || endDate <= startDate) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La hora fin debe ser mayor a la hora inicio',
          confirmButtonColor: '#0A6EBD',
          allowOutsideClick: false
        });
        return false;
      }
  
      return true;
    }

    guardarValorInicio(dia: any[]) {
      //this.valoresInicio[dia] = [this.horaInicio.value!,this.horaFin.value!];
      if (dia.length === 0) {
        throw new Error('La lista está vacía');
      }

      
      if(dia.length === 1){
        let date = this.obtenerFecha(dia[0]);
        let week = this.getWeek(date);
        console.log('este el el primer lengt', dia)
        this.mHorario = {
          horaInicio: this.horaInicio.value as string,
          horaFin: this.horaFin.value as string,
          week: week.toString(),
          userEntityId: this.idUserByEmployeCode,
          day: dia[0],
          fechaWorking: date.toISOString(),
          ano: date.getFullYear().toString()
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
          let date = this.obtenerFecha(x.day);
          let week = this.getWeek(date);
          this.mHorario= {
            horaInicio:  this.convertirHoraAMPMa24(x.horaInicio) as string,
            horaFin: this.convertirHoraAMPMa24(x.horaFin) as string,
            week: week.toString(),
            userEntityId: this.idUserByEmployeCode,
            day: x.day,
            ano: date.getFullYear().toString(),
            fechaWorking:date.toISOString(),
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

    obtenerFecha(diain:string){
      var dia;
      var diafor="";
      switch(diain){
        case "Lunes":
          diafor = this.week1[1].toLocaleDateString('es-MX').split("/");
          break;
        case "Martes":
          diafor = this.week1[2].toLocaleDateString('es-MX').split("/");
          break;
        case "Miércoles":
          diafor = this.week1[3].toLocaleDateString('es-MX').split("/");
          break;
        case "Jueves":
          diafor = this.week1[4].toLocaleDateString('es-MX').split("/");
          break;
        case "Viernes":
          diafor = this.week1[5].toLocaleDateString('es-MX').split("/");
          break;
        case "Sábado":
          diafor = this.week1[6].toLocaleDateString('es-MX').split("/");
          break;
        case "Domingo":
          diafor = this.week1[0].toLocaleDateString('es-MX').split("/");
          break;
      }
    
      /*
      0: "10"
      1: "20"
      2: "2023"
    */
      dia = new Date(diafor[2] + "/" + (diafor[1].length==1? "0"+diafor[1]:diafor[1]) +"/"+(diafor[0].length==1? "0"+diafor[0]:diafor[0]));
      return dia
    
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

    applyFilter(event: any) {
      let codeEmploye = (event.target as HTMLInputElement).value;
      this.consultUserByEmployee
        .GetUserIdByEmployeCode(codeEmploye, this.pais.value!)
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

    consultarHorarioEmpleado(){
      this.cdr.detectChanges();
      this.mHorarioListExcel=[];
      let pais= this.storageFestivos.obtenerDatosMapeados();
      let date = new Date(this.date.value as unknown as Date);
      let fechadia = date.getDate();
      let fechames = (date.getMonth()+1);
      let fechaanio = date.getFullYear();
      
    
      if(this.habilitarHorariobyFecha && this.habilitarHorario){
        this.serviceList.loadHorarios(this.idUserByEmployeCode, date).subscribe(horario => {
          
          if(horario!=null){
  
         
  
          horario.forEach(element => {
            let rowseasona ={
              day: element.day, 
              horaInicio: element.horaInicio, 
              horaFin: element.horaFin,
              userEntityId: element.userEntityId,
              week: element.week,
              ano: element.ano,
              fechaWorking: element.fechaWorking
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
          }else{
            //this.habilitarHorario=false;
            //this.habilitarHorariobyFecha = false;
          }
  
        }else{
          //this.habilitarHorario=false;
          //this.habilitarHorariobyFecha = false;
  
          /*if(this.picker){
            this.picker?.select(null);
            }
            this.semanaAno='';*/
            date.setDate(date.getDate() - date.getDay());
            for (let dato of this.Datos) {
              dato.date = new Date(date);
              date.setDate(date.getDate()+1);
            }
        }
       
        });
      }
    }

    openDialogHorario(horario: any[]) {
      console.log('esto es open dialog de horario ')
    const dialogRef=  this.dialog.open(PopUpHorarioComponent, {
        data: {
          horario: horario,
        },
      });
  
      dialogRef.afterClosed().subscribe(
        (data=>{
  
          console.log('closing window...');
          this.semanaAno='';
          this.ngOnInit();
          /*if(this.picker){
            this.picker?.select(null);
            }
            this.semanaAno='';
            this.habilitarHorario=false;
            this.habilitarHorariobyFecha = false;*/
        }
  
        )
      )
    }

    onKeyPressOnlyNumbers(event: KeyboardEvent): void {
      const inputValue = (event.target as HTMLInputElement).value;
      const isDotOrComma = inputValue.includes('.') || inputValue.includes(',');
    
      if (!/[\d.,]/.test(event.key) || (isDotOrComma && (event.key === '.' || event.key === ','))) {
        event.preventDefault();
      }
    }
    
    onKeyPressOnlyLettersNumbers(event: KeyboardEvent): void {
      const inputValue = (event.target as HTMLInputElement).value;
    
      if (!/^[a-zA-Z0-9]+$/.test(event.key)) {
        event.preventDefault();
      }
    }

    getWeek(date: Date): number {
      let onejan = new Date(date.getFullYear(), 0, 1);
      return Math.ceil(
        ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) /
          7
      );
    }

    onDateChange(event: any) {
      this.week1 = [];
      let date = new Date(this.date.value as unknown as Date);
      let year = date.getFullYear().toString();
      let week = this.getWeek(date);
      this.semanaAno = week.toString();
      this.fechaSemanaAno = year;
      console.log(this.fechaSemanaAno,' ano ', this.semanaAno, ' semana')
      this.habilitarHorariobyFecha = true;
  
      var current = new Date(date);
      if(current.getDay() != 0){
          current.setDate(((current.getDate() - current.getDay())));
      }
      this.week1.push(new Date(current));//Agrega el primer dia al array
  
      for (let index = 1; index < 7; index++) {
        current.setDate((current.getDate() - current.getDay())+index);//Define el septimo dia
        this.week1.push(new Date(current));
        
      }
  
      if(this.habilitarHorariobyFecha && this.habilitarHorario){
        this.consultarHorarioEmpleado();
      }
  
    }

    readExcelHorario(file: any) {

      this.readFileHorario(file.files);


     // if (this.validarArchivo(file)) {
       // this.barraProgreso(true);
      //  this.readFileHorario(file.files);
     // } else {
       // console.log('Error: Uno o más archivos no pasaron la validación');
       // this.barraProgreso(false);
     // }
      
    }

    cargarArchivoHorario() {
      let elemento = document.getElementById('fileInputHorario');
      if(elemento) {
        elemento.click();
        this.agregarFestivos = true;
      } else {
        console.log("No se encontró el elemento con id 'fileInputHorario'");
      }
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

    //subir plantilla
  manejarArchivoHorario(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length == 0) throw new Error('No ha seleccionado ningun archivo');
    if (target.files.length !== 1) throw new Error('No se puede cargar múltiples archivos');
    const reader: FileReader = new FileReader();


    reader.onload = (e: any) => {
     //===========================================================================
            var workBook = XLSX.read(reader.result, { type: 'binary' });
            var sheetNames = workBook.SheetNames;
            this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
            let valiFile = true;
            this.columnasexcel.forEach(element => {
              if (!this.ExcelData[0][element]) {
                valiFile=false; 
              }   
            });
            if (!valiFile) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El archivo es inválido por favor verifique: \n * Columnas incorrectas',
                confirmButtonColor: '#0A6EBD',
              });
              this.fileInputHorario.nativeElement.value = null;
              // this.activarBarra = false;
            }else{
              let XL_row_object = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
              let json_object = JSON.stringify(XL_row_object);
              // aqui parseamos a json
              const datos = JSON.parse(json_object);
              console.log(this.ExcelData);
              if(this.ExcelData.length){

                console.log(this.ExcelData);
                this.loadArpExcelService.PostLoadHorarios(this.ExcelData).subscribe((data: any) => {
                  debugger;
                  console.log(data);
                  if(data.data){
                    Swal.fire({
                      icon: 'success',
                      title: 'Carga de archivo completada.',
                      confirmButtonColor: '#0A6EBD',
                    });
                    this.fileInputHorario.nativeElement.value = null;
                    // this.activarBarra = false;
                  }else{
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Error:  No se pudo cargar el archivo, porfavor reviselo.',
                      confirmButtonColor: '#0A6EBD',
                    });
                    this.fileInputHorario.nativeElement.value = null;
                  }
                });
                
                console.log("El archivo pasa")
                //this.botonHorario = false;
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error:  Archivo vacio.',
                  confirmButtonColor: '#0A6EBD',
                });
                // this.botonHorario = false;
              }
            }

     //===========================================================================
    };
  
    reader.readAsBinaryString(target.files[0]);
  }


  readFileHorario(fileInput: any) {
      let file = fileInput[0]; // Accede al primer archivo seleccionado
  
      if (file) {
        let fileReader = new FileReader();
  
        fileReader.readAsBinaryString(file);
  
        fileReader.onload = (e) => {
          var workBook = XLSX.read(fileReader.result, { type: 'binary' });
          var sheetNames = workBook.SheetNames;
          this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
          let valiFile = true;
          this.columnasexcel.forEach(element => {
            if (!this.ExcelData[0][element]) {
              valiFile=false; 
            }   
          });
          if (!valiFile) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El archivo es inválido por favor verifique: \n * Columnas incorrectas',
              confirmButtonColor: '#0A6EBD',
            });
            this.fileInputHorario.nativeElement.value = null;
           // this.activarBarra = false;
          }else{
            let XL_row_object = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
            let json_object = JSON.stringify(XL_row_object);
            // aqui parseamos a json
            const datos = JSON.parse(json_object);
            console.log(this.ExcelData);
            if(this.ExcelData.length){
  
              console.log(this.ExcelData);
              this.loadArpExcelService.PostLoadHorarios(this.ExcelData).subscribe(data => {
                console.log(data);
                if(data){
                  Swal.fire({
                    icon: 'success',
                    title: 'Carga de archivo completada.',
                    confirmButtonColor: '#0A6EBD',
                  });
                  this.fileInputHorario.nativeElement.value = null;
                 // this.activarBarra = false;
                }else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error:  No se pudo cargar el archivo, porfavor reviselo.',
                    confirmButtonColor: '#0A6EBD',
                  });
                  this.fileInputHorario.nativeElement.value = null;
                }
              });
              
              console.log("El archivo pasa")
              //this.botonHorario = false;
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error:  Archivo vacio.',
                confirmButtonColor: '#0A6EBD',
              });
             // this.botonHorario = false;
            }
          }
          
  
          
        }
      } else {
        console.error("No se ha seleccionado ningún archivo.");
      }
    }

    exportToExcelHours(){

      let name = "Plantilla_Horarios.xlsx";
      let pais= this.storageFestivos.obtenerDatosMapeados();
      let season: any[] =[];
      let date = new Date(this.date.value as unknown as Date);
      let fechadia = date.getDate();
      let fechames = (date.getMonth()+1);
      let fechaanio = date.getFullYear();
      let fechadiast = fechadia<10?"0"+fechadia:fechadia
      this.mHorarioListExcel.forEach(element => {
        let fechsplit = new Date(element.fechaWorking.toString()).toLocaleDateString();
        let diafor=fechsplit.split("/");
        let diaformat = diafor[2] + "/" + (diafor[1].length==1? "0"+diafor[1]:diafor[1]) +"/"+(diafor[0].length==1? "0"+diafor[0]:diafor[0])
        let rowseason ={
          dia: element.day, 
          horaInicio: element.horaInicio, 
          horaFin: element.horaFin,
          fechaWorking: diaformat,
          codigo_Empleado: element.userEntityId, 
          pais: pais.countryEntity.nameCountry
        };
        season.push(rowseason);
      });

      if(season.length==0){
        season = [
          { 
            dia: 'Lunes', 
            horaInicio: '00:00', 
            horaFin: '00:00',
            fecha: 'dd/MM/YYYY', 
            codigo_Empleado: '', 
            pais: pais.countryEntity.nameCountry
          },
          { 
            dia: 'Martes', 
            horaInicio: '00:00', 
            horaFin: '00:00' 
          },
          { 
            dia: 'Miércoles', 
            horaInicio: '00:00', 
            horaFin: '00:00' 
          },
          { 
            dia: 'Jueves', 
            horaInicio: '00:00', 
            horaFin: '00:00' 
          },
          { 
            dia: 'Viernes',
            horaInicio: '00:00', 
            horaFin: '00:00' 
          },
        ];
      }
       
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(season);
  
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');
  
      XLSX.writeFile(book, name);
      console.log(book);
    }

    crearHorario() {
      this. mHorarioList = this.mHorarioList.
      filter(horario => horario.horaInicio !== '' && horario.horaFin !== '');
  
      console.log(this.mHorarioList, 'esto es lo que se envia en la creacion')
  
      console.log(this.mHorarioList);
      if(this.mHorarioList.length){
        let valid = this.validateHorarios();
        if (!valid) return;

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
           this.codeEmployed = new FormControl("");
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

    resetEditable() {
      this.Datos.forEach(dato => {
        dato.editable = false;
      });
    }

    selectAux(countryId:string){
      this.cdr.detectChanges();
  
      this.agregarFestivos = false;
      
  
      if (this.pais.value !== null) {
        this.codeEmployed.reset();
        this.date.reset();
        this.mHorarioList = []
        this.habilitarHorario = false;
        this.habilitarHorariobyFecha = false;
        this.habilitarExcel = true
        this.idCountryGlobal = countryId;
        let idCountry: string = countryId;
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

    downloadTemplate() {
      this.scheduleService.getTemplate().subscribe(resp => {
        let m: any = (resp.headers.get('content-disposition') as string).match(/filename=\"?([^;\"]+)\"?;?/);
        const fileName = m? m[1] : '';
        const blob = new Blob([resp.body]);
        const url= window.URL.createObjectURL(blob);
        this.downloadTemplateEl.nativeElement.href = url;
        this.downloadTemplateEl.nativeElement.download = fileName;
        this.downloadTemplateEl.nativeElement.click();
        /* window.open(url); */
        /* if(data){
          Swal.fire({
            icon: 'success',
            title: 'Carga de archivo completada.',
            confirmButtonColor: '#0A6EBD',
          });
          this.fileInputWorkdayG.nativeElement.value = null;
          this.activarBarra = false;
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error:  No se pudo cargar el archivo, porfavor reviselo.',
            confirmButtonColor: '#0A6EBD',
          });
          this.fileInputWorkdayG.nativeElement.value = null;
        } */
      });
    }

}
