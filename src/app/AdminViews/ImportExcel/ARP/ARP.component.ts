import { Component, ViewChild } from "@angular/core";
import { StorageService } from "src/app/Service/storage-service/storage.service";
import { LoadArpExcelService } from "src/app/AdminViews/ImportExcel/services/LoadArpExcel/LoadArpExcel.service"
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MUserEntity } from 'src/app/Models/MUserEntity';
import Swal from "sweetalert2";
import { MCountryEntity } from "src/app/Models/MCountryEntiry";
import { ListCountryService } from "../../AdminCountries/services/list-country/list-country.service";
import { Observable, Subject, Subscription, forkJoin, interval, map } from "rxjs";
import { MResponseLoadGuid, MSummary, MSummaryFinal } from "src/app/Models/MSummary";
import { Guid } from "guid-typescript";
import { MGmt } from 'src/app/Models/MGmt';
import { MatTableDataSource } from "@angular/material/table";
import { ObtenerlistaService } from "src/app/Service/listados/obtenerlista.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { PopUpAddLoadComponent } from "../pop-up-add-load/pop-up-add-load.component";
import { PopUpLoadDetailComponent } from "../pop-up-load-detail/pop-up-load-detail.component";

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-ARP',
  templateUrl: './ARP.component.html',
  styleUrls: ['./ARP.component.css']
})

export class ARPComponent {

  @ViewChild('fileInput1') fileInput1: any;
  @ViewChild('fileInput2') fileInput2: any;
  @ViewChild('fileInput3') fileInput3: any;
  @ViewChild('fileInput4') fileInput4: any;
  @ViewChild('fileInputWorkdayHoras') fileInputWorkdayHoras: any;
  @ViewChild('fileInputWorkdayUsers') fileInputWorkdayUsers: any;
  @ViewChild('downloadWorkdayFileEl') downloadWorkdayFileEl: any;
  @ViewChild('downloadARPFileEl') downloadARPFileEl: any;
  @ViewChild('fileInputUserGMT') fileInputUserGMT: any;
  @ViewChild('loadsPaginator') loadsPaginator!: MatPaginator;

  ExcelData: any;
  excelData1: any;
  excelData2: any;
  excelData3: any;
  ExcelData1: any;
  ExcelData2: any;
  file: File | null = null;
  fileArp = new FormControl('');
  selectedFile: File | null = null;
  MUser: MUserEntity;
  Approving: boolean = false;
  showImgARP: boolean = false;
  showImgTSE: boolean = false;
  showImgSTE: boolean = false;
  porcentajeCarga:number = 0;
  mensajeProgressBar:string = "";
  activarBarra = false;
  activarBarraHorarios = false;
  activarBarraWorkday = false;
  botonARP = false;
  botonTSE= false;
  botonSTE = false;
  paisSeleccionado = false;
  botonHorario = false;
  botonWorkdayHoras = false;
  botonWorkdayUsers = false;
  botonUsers = false;
  columnasexcel:string[]=["dia","horaInicio","horaFin","fecha","codigo_Empleado","pais"];
  columnasARP:string[]=["DOC_NUM","TOOL","PAIS","ID_EMPLEADO","NUMERO_CLIENTE","NOMBRE_CLIENTE","ESTADO","FECHA_REP","HORA_INICIO","HORA_FIN","TOTAL_MINUTOS","CATEGORIA","ACTIVIDAD","COMENTARIO","FECHA_EXTRATED"];
  columnasTSE:string[]=["Recurso de servicio: Usuario: ISO 2","TSE: Work Order","Recurso de servicio: Usuario: Número de empleado","Recurso de servicio: Usuario: Zona horaria","Orden de trabajo: Caso: Account CMR Number","Orden de trabajo: Caso: Account Name Text","TSE: Status","TSE: Start Time","TSE: End Time","Duration in Hours","WO: Subject"];
  columnasSTE:string[]=["Session Time Unique ID","Session Time Support Agent Country","Número del caso","Session Time Creator Employee Serial Number","Account CMR Number","Nombre de la cuenta: Nombre de la cuenta","Start Date/Time","End Date/Time","Session Time: Total Duration","Case Subject"];
  columnasexcelWorkdayHoras:string[]=["Employee ID","Worker","Reported Date","Original Reported Quantity","Time Type","Status","Calculated Date","In Time","Out Time","Calculated Quantity","Calculation Tags","Source Time or Time Off Block"];
  columnasexcelWorkdayUsers:string[]=["Worker", "Employee ID", "Legal Name", "Preferred Name", "Home CNUM"];
  columnasUSRZH:string[]=["Número de empleado","Zona horaria"];
  pais = new FormControl('');
  MListCountry: MCountryEntity[];
  MListGMT: MGmt[];
  mSummary: MSummary;
  mSummaryFinal: MSummaryFinal;
  mResponseLoadGuid:MResponseLoadGuid;
  intervalSubscriptionFiles: Subscription | undefined;
  loadsDataSource = new MatTableDataSource<any>();
  columnasAMostrarCarga = ['idArpLoad', 'fechaCreacion', 'nombreEmpleado', 'arpCarga', 'tseCarga', 'steCarga', 'status'];
  loadsFilters: any[] = [{name: 'nombreEmpleado', value: ''}];
  
  constructor(
    private storageService: StorageService, 
    private loadArpExcelService: LoadArpExcelService,
    private apiListCountry: ListCountryService, 
    private refresh: ObtenerlistaService, 
    private dialog: MatDialog,
  ) {
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.MListCountry = [];
    this.MListGMT = [];
    this.mSummary = {} as MSummary;
    this.mSummaryFinal = {} as MSummaryFinal;
    this.mResponseLoadGuid = {} as MResponseLoadGuid;
    this.porcentajeCarga=0;
  }
  ngOnInit() {
   
    console.log('Datos ' , this.botonARP , this.botonTSE , this.botonSTE, this.paisSeleccionado);
    this.validateRole();
    this.consultcountries();
    
    this.refresh.refreshLoadList$.subscribe((loads) => {
      this.loadsDataSource.data = loads;
    });
    this.refresh.loadListLoads();
  }

  ngAfterViewInit() {
    this.loadsDataSource.paginator = this.loadsPaginator;
  }

  onLoadsFilterChange(columnName: string, event: any) {
    this.applyLoadsFilter(event);
  }

  applyLoadsFilter(event: any) {
    let value = (event.target as HTMLInputElement).value;
    this.loadsDataSource.filterPredicate = (data: any, filter: string) => {
      const nombreCoincide = `${data.userEntity.nameUser.toLowerCase()} ${data.userEntity.surnameUser.toLowerCase()}`.includes(filter);
      return nombreCoincide;
    };
    this.loadsDataSource.filter = value.trim().toLowerCase();

  }

  addLoad() {
    let dialogRef = this.dialog.open(PopUpAddLoadComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.refreshLoadList();
    });
  }

  onLoadRowClick(row: any) {
    this.showLoadDetail(row);
  }

  showLoadDetail(load: any) {
    let dialogRef = this.dialog.open(PopUpLoadDetailComponent, {data: {id: load.idArpLoad}});

    dialogRef.afterClosed().subscribe(result => {
      this.refreshLoadList();
    });
  }

  refreshLoadList(){
    this.refresh.loadListLoads();
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

  barraProgreso(estatus:boolean){
    this.activarBarra = estatus;
   // setTimeout(() => {
      //this.activarBarra = !estatus;
      this.botonARP = !estatus;
      this.botonSTE = !estatus;
      this.botonTSE = !estatus;
      this.botonHorario=!estatus;
      if(!estatus){
        this.fileInput1.nativeElement.value = null;
        this.fileInput2.nativeElement.value = null;
        this.fileInput3.nativeElement.value = null;
        this.fileInput4.nativeElement.value = null;

      }
     

     
 // }, 4 * 60 * 1000);
  }

  activarARP(boton: string,fileEvent: any){
    const file = fileEvent.target.files[0];
    const typeFile = file.type.split('/');
    const filemb: number = file.size / 1024;
    switch (boton){
      case 'Horario':
        this.botonHorario = true;
        return
      case 'WorkdayHoras':
        this.botonWorkdayHoras = true;
        return;
      case 'WorkdayUsers':
        this.botonWorkdayUsers = true;
        return;
      case 'UserGMT':
        this.botonUsers = true;
        return;

        
    }

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
          this.fileInput4.nativeElement.value = null;
          this.activarBarra = false;
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
                this.fileInput4.nativeElement.value = null;
                this.activarBarra = false;
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error:  No se pudo cargar el archivo, porfavor reviselo.',
                  confirmButtonColor: '#0A6EBD',
                });
                this.fileInput4.nativeElement.value = null;
              }
            });
            
            console.log("El archivo pasa")
            this.botonHorario = false;
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error:  Archivo vacio.',
              confirmButtonColor: '#0A6EBD',
            });
            this.botonHorario = false;
          }
        }
        

        
      }
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }

  readFileWorkdayG(horasFileInput: any, usersFileInput: any) {
    let hoursFile = horasFileInput[0]; // Accede al primer archivo seleccionado
    let usersFile = usersFileInput[0]; // Accede al primer archivo seleccionado

    if (hoursFile || usersFile) {
      forkJoin({hours: this.readFileWorkdayHours(hoursFile), users: this.readFileWorkdayUsers(usersFile)}).subscribe({
        next: data => {
          console.log('data', data);
          
          let datas = {
            hours: data.hours,
            users: data.users,
          };
          this.loadArpExcelService.PostLoadHorariosWorkdayG(datas).subscribe(resp => {
            this.activarBarraWorkday = false;
            const m = (resp.headers.get('content-disposition') as string).match(/filename=\"?([^;\"]+)\"?;?/);
            const fileName = m? m[1] : '';
            const blob = new Blob([resp.body]);
            const url= window.URL.createObjectURL(blob);
            this.downloadWorkdayFileEl.nativeElement.href = url;
            this.downloadWorkdayFileEl.nativeElement.download = fileName;
            this.downloadWorkdayFileEl.nativeElement.click();
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
          
          this.fileInputWorkdayHoras.nativeElement.value = "";
          this.fileInputWorkdayUsers.nativeElement.value = "";
          console.log("El archivo pasa");
          this.botonWorkdayHoras = false;
          this.botonWorkdayUsers = false;

        },
        error: (e) => {
          console.log('error', e);
          this.activarBarraWorkday = false;
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
 
  
  validateRole() {
    if (this.MUser.rolEntity.nameRole == 'Administrador' || this.MUser.rolEntity.nameRole == 'Super Administrador') {
      this.Approving = true;
    }
  }

  readExcelHorario(file: any) {
    if (this.validarArchivo(file)) {
      this.barraProgreso(true);
      this.readFileHorario(file.files);
    } else {
      console.log('Error: Uno o más archivos no pasaron la validación');
      this.barraProgreso(false);
    }
    
  }

  readExcelWorkdayG(horasFile: any, usersFile: any) {
    if (this.validarArchivo(horasFile) && this.validarArchivo(usersFile)) {
      this.activarBarraWorkday = true;
      this.readFileWorkdayG(horasFile.files, usersFile.files);
    } else {
      console.log('Error: Uno o más archivos no pasaron la validación');
      this.activarBarraWorkday = false;
    }
   // this.barraProgreso()
  }

  select(selPais: any) {
    console.log(selPais.value);
    this.paisSeleccionado = true;
  }

  unsubscribeIntervalSubscriptionFiles(): void {
    if (this.intervalSubscriptionFiles) {
      this.intervalSubscriptionFiles.unsubscribe();
    }
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

        }else{
          this.Approving = false
        }
      });

  
  }

  readExcelUsers(fileInputUsergmt: any) {
    
    this.activarBarra = true;
    
    if (this.validarArchivo(fileInputUsergmt)) {
      
      this.readfileUserGMT(fileInputUsergmt.files);
      
    } else {
      console.log('Error: Uno o más archivos no pasaron la validación');
      this.activarBarra = false;
      this.botonUsers = false;
      
    }
  }

  readfileUserGMT(fileInputUserGmt: any){

    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      width: 0
    });
    
    let file = fileInputUserGmt[0]; 
    

    if (file) 
    {
      let fileReader = new FileReader();
      

      fileReader.readAsBinaryString(file);
      
      

      fileReader.onload = (e) => {
          var workBook = XLSX.read(fileReader.result, { type: 'binary' });
          var sheetNames = workBook.SheetNames;
          this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });

          if(this.ExcelData.length > 0){
            let valiFile = true;
            this.columnasUSRZH.forEach(element => {
              if (this.ExcelData[0][element]==undefined) {
                valiFile=false; 
              }   
            });
            if (!valiFile) {
              this.fileInputUserGMT.nativeElement.value = null;
              this.activarBarra = false;
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El archivo es inválido por favor verifique: \n * Columnas incorrectas',
                confirmButtonColor: '#0A6EBD',
              });
              
            }else{
              console.log('inicia carga');
              console.log("idCarga:::::USERSGMT");
              //carga ARP
              this.loadArpExcelService.UploadUserGMT(this.ExcelData).subscribe( data => { 
                console.log(data);
                if(data.data=="Success"){
                  Swal.fire({
                    icon: 'success',
                    title: 'Carga de archivo completada.',
                    confirmButtonColor: '#0A6EBD',
                  });
                  this.fileInputUserGMT.nativeElement.value = null;
                  this.activarBarra = false;
                }else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error:  No se pudo cargar el archivo, porfavor reviselo.',
                    confirmButtonColor: '#0A6EBD',
                  });
                  this.fileInputUserGMT.nativeElement.value = null;
                  this.activarBarra = false;
                }
              });   
            }

          }else{
            this.fileInputUserGMT.nativeElement.value = null;
            this.activarBarra = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El archivo no contiene información, por favor verifique!',
              confirmButtonColor: '#0A6EBD',
            });
          }
      }
    } else {
      console.error("No se ha seleccionado ningún archivo.");
      
      this.activarBarra = false;
    }

    this.botonUsers = false;
    
    this.fileInputUserGMT.nativeElement.value = null;
  }


}

