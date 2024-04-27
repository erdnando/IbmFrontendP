import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApproverListService } from 'src/app/AdminViews/AdminApprover/services/approverList/approver-list.service';
import { MAprobador } from 'src/app/Models/MAprobador';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MFestivos } from 'src/app/Models/MFestivos';
import { Observable, Subject, Subscription, forkJoin, map } from 'rxjs';
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
import { DatePipe, Time } from '@angular/common';
import { LoadArpExcelService } from 'src/app/AdminViews/ImportExcel/services/LoadArpExcel/LoadArpExcel.service';
import { ScheduleService } from 'src/app/Service/schedule/schedule.service';
import { MatPaginator } from '@angular/material/paginator';

interface MiObjeto {
  [key: string]: any;
}
interface MiObjetoApp {
  [key: string]: any;
}

type Aoa = any[][];

@Component({
  selector: 'app-workday',
  templateUrl: './workday.component.html',
  styleUrls: ['./workday.component.css'],
  providers: [DatePipe]
})
export class WorkdayComponent {

  @ViewChild('fileInputWorkdayHoras') fileInputWorkdayHoras: any;
  @ViewChild('fileInputWorkdayUsers') fileInputWorkdayUsers: any;
  @ViewChild('downloadWorkdayFileEl') downloadWorkdayFileEl: any;
  @ViewChild('mworkdaysPaginator') mworkdaysPaginator!: MatPaginator;
  
  columnasAMostrar = ['id_empleado', 'nombre_empleado', 'tipo', 'fecha', 'hora_inicio', 'hora_fin', 'horas', 'resultado_aprobacion'];
  
  MUser: any;
  
  columnasexcel:string[]=["#", "NOMBRE DIA", "HORA INICIO", "HORA FIN", "FECHA", "CODIGO EMP", "PAIS"];
  columnasexcelWorkdayHoras:string[]=["Employee ID","Worker","Reported Date","Original Reported Quantity","Time Type","Status","Calculated Date","In Time","Out Time","Calculated Quantity","Calculation Tags","Source Time or Time Off Block"];
  columnasexcelWorkdayUsers:string[]=["Worker", "Employee ID", "Legal Name", "Preferred Name", "Home CNUM"];
  
  ExcelData: any;
  datosTable:any [] = [];
  week1:any[] = [];
  result: any[] = [];
  activarBarra: boolean = false;
  botonWorkdayHoras = false;
  botonWorkdayUsers = false;
  confirmedControl = new FormControl(false);
  MWorkdays = new MatTableDataSource<any>();
  MWorkdayFilters: any[] = [];
  uploaded: boolean = false;
  
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
    private datePipe: DatePipe
  ) {
    this.MUser = this.storageFestivos.obtenerDatosMapeados();
  }
  
  ngOnInit() {

  }

  ngAfterViewInit() {
    this.MWorkdays.paginator = this.mworkdaysPaginator;
  }

  activarARP(boton: string,fileEvent: any){
    const file = fileEvent.target.files[0];
    const typeFile = file.type.split('/');
    const filemb: number = file.size / 1024;
    switch (boton){
      case 'WorkdayHoras':
        this.botonWorkdayHoras = true;
        return;
      case 'WorkdayUsers':
        this.botonWorkdayUsers = true;
        return;
    }      

  }

  readExcelWorkdayG(horasFile: any, usersFile: any) {
    if (this.validarArchivo(horasFile) && this.validarArchivo(usersFile)) {
      this.activarBarra = true;
      this.readFileWorkdayG(horasFile.files, usersFile.files);
    } else {
      console.log('Error: Uno o más archivos no pasaron la validación');
      this.activarBarra = false;
    }
   // this.barraProgreso()
  }

  readFileWorkdayHours(file: any): Observable<any> {
    let sub = new Subject<any>();

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
      
    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      let ExcelData: any = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false, range: 1 });
      console.log('exceldata', ExcelData);
      console.log('exceldata 0', ExcelData[0]);
      
      console.log(ExcelData.length);
      let valiFile = true;
      this.columnasexcelWorkdayHoras.forEach(element => {
        console.log('VALOR ES .. ' + ExcelData[0][element])
        if (!ExcelData[0][element]) { 
          valiFile=false; 
        }   
      });
      if (!valiFile) {
        this.fileInputWorkdayHoras.nativeElement.value = null;
        this.activarBarra = false;
        sub.error('El archivo es inválido por favor verifique: \n * Columnas incorrectas');
      }else{
        sub.next(ExcelData);
        sub.complete();
      }
      
    }

    return sub.asObservable();
  }

  readFileWorkdayUsers(file: any): Observable<any> {
    let sub = new Subject<any>();

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
      
    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      let ExcelData: any[] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false, blankrows: false, header: this.columnasexcelWorkdayUsers, range: 1});
      console.log('exceldata', ExcelData);
      console.log('exceldata 0', ExcelData[0]);
      
      let valiFile = true;
      this.columnasexcelWorkdayUsers.forEach(element => {
        console.log('VALOR ES .. ' + ExcelData[0][element])
        if (!ExcelData[0][element]) { 
          valiFile=false; 
        }   
      });
      if (!valiFile) {
        this.fileInputWorkdayUsers.nativeElement.value = null;
        this.activarBarra = false;
        sub.error('El archivo es inválido por favor verifique: \n * Columnas incorrectas');
      }else{
        sub.next(ExcelData);
        sub.complete();
      }
      
    }

    return sub.asObservable();
  }

  readFileWorkdayG(horasFileInput: any, usersFileInput: any) {
    let hoursFile = horasFileInput[0]; // Accede al primer archivo seleccionado
    let usersFile = usersFileInput[0]; // Accede al primer archivo seleccionado
    if (hoursFile || usersFile) {
      this.uploaded = false;
      forkJoin({hours: this.readFileWorkdayHours(hoursFile), users: this.readFileWorkdayUsers(usersFile)}).subscribe({
        next: data => {
          console.log('data', data);
          let datas = {
            hours: data.hours,
            users: data.users,
          };
          this.loadArpExcelService.PostLoadHorariosWorkdayG(datas).subscribe(resp => {
            this.activarBarra = false;
            this.uploaded = true;
            console.log(resp);
            this.MWorkdays.data = resp.data;
            /* const m = (resp.headers.get('content-disposition') as string).match(/filename=\"?([^;\"]+)\"?;?/);
            const fileName = m? m[1] : '';
            const blob = new Blob([resp.body]);
            const url= window.URL.createObjectURL(blob);
            this.downloadWorkdayFileEl.nativeElement.href = url;
            this.downloadWorkdayFileEl.nativeElement.download = fileName;
            this.downloadWorkdayFileEl.nativeElement.click(); */
          });
          
          this.fileInputWorkdayHoras.nativeElement.value = "";
          this.fileInputWorkdayUsers.nativeElement.value = "";
          console.log("El archivo pasa");
          this.botonWorkdayHoras = false;
          this.botonWorkdayUsers = false;

        },
        error: (e) => {
          console.log('error', e);
          this.activarBarra = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e,
            confirmButtonColor: '#0A6EBD',
          });
          this.botonWorkdayHoras = false;
          this.botonWorkdayUsers = false;
        }
      });
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }

  exportExcel() {
    // Reorder the columns creating new objects and their options.
    let data = this.MWorkdays.data.map(x => {
      return {
        employeeCode: x.employeeCode,
        employeeName: x.employeeName,
        type: x.type,
        date: this.datePipe.transform(x.date, 'yyyy-MM-dd', 'UTC'),
        startTime: x.startTime,
        endTime: x.endTime,
        hours: x.hours,
        finalStatus: x.finalStatus
      };
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');
    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [["Id Empleado", "Nombre Empleado", "Tipo Reporte", "Fecha del Reporte", "Hora Inicio", "Hora Fin", "Total Horas", "Resultado Aprobacion"]], { origin: "A1" });
  
    XLSX.writeFile(book, "Workday.xlsx");
    console.log(book);
  }

  validarArchivo(event: any) {
    let archivos = event.files;
    for (let i = 0; i < archivos.length; i++) {
      let archivo = archivos[i];
      let extension = archivo.name.split('.').pop().toLowerCase();
      if (extension !== 'xls' && extension !== 'xlsx') {
        console.log('Error: Solo se permiten archivos .xls o .xlsx');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error:  Uno o más archivos no pasaron la validación, solo se permiten archivos .xls o .xlsx',
          confirmButtonColor: '#0A6EBD',
        });
        return false;
      } 
    }
    return true;
  }


}
