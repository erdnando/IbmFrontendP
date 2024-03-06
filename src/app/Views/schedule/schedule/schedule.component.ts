import { ChangeDetectorRef, Component } from '@angular/core';
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

interface MiObjeto {
  [key: string]: any;
}
interface MiObjetoApp {
  [key: string]: any;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {

  Datos = [
    { day: 'Lunes', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Martes', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Miércoles', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Jueves', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Viernes', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Sábado', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
    { day: 'Domingo', horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: false },
  ];
  
  columnasAMostrar = ['dias', 'inicio','a', 'fin', 'checkbox'];
  
  
  MApprover: MAprobador[];
  a : MAprobador[];
  MUser: any;


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
          fechaWorking: this.obtenerFecha(dia[0]),
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
            ano: this.fechaSemanaAno,
            fechaWorking:this.obtenerFecha(x.day),
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
        this.serviceList.loadHorarios(this.idUserByEmployeCode, this.semanaAno, this.fechaSemanaAno).subscribe(horario => {
          
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

    onDateChange(event: any) {

      function getWeek(date: Date): number {
        let onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil(
          ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) /
            7
        );
      }
  
      this.week1 = [];    
  
      let date = new Date(this.date.value as unknown as Date);
      let year = date.getFullYear().toString();
      let week = getWeek(date);
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

}
