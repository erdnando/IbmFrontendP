import { Component, ViewChild } from "@angular/core";
import { StorageService } from "src/app/Service/storage-service/storage.service";
import { LoadArpExcelService } from "src/app/AdminViews/ImportExcel/services/LoadArpExcel/LoadArpExcel.service"
import * as XLSX from 'xlsx';
import { FormControl } from "@angular/forms";
import { MUserEntity } from 'src/app/Models/MUserEntity';
import Swal from "sweetalert2";
import { MCountryEntity } from "src/app/Models/MCountryEntiry";
import { ListCountryService } from "../../AdminCountries/services/list-country/list-country.service";
import { Subscription, interval, map } from "rxjs";
import { MResponseLoadGuid, MSummary, MSummaryFinal } from "src/app/Models/MSummary";
import { Guid } from "guid-typescript";
import { MGmt } from 'src/app/Models/MGmt';

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
  @ViewChild('fileInputWorkdayG') fileInputWorkdayG: any;

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
  porcentajeCarga:number;
  activarBarra = false;
  botonARP = false;
  botonTSE= false;
  botonSTE = false;
  botonHorario = false;
  botonWorkdayG = false;
  columnasexcel:string[]=["dia","horaInicio","horaFin","fecha","codigo_Empleado","pais"];
  columnasARP:string[]=["DOC_NUM","TOOL","PAIS","ID_EMPLEADO","NUMERO_CLIENTE","NOMBRE_CLIENTE","ESTADO","FECHA_REP","HORA_INICIO","HORA_FIN","TOTAL_MINUTOS","CATEGORIA","ACTIVIDAD","COMENTARIO","FECHA_EXTRATED"];
  columnasTSE:string[]=["Recurso de servicio: Usuario: ISO 2","TSE: Work Order","Recurso de servicio: Usuario: Número de empleado","Recurso de servicio: Usuario: Zona horaria","Orden de trabajo: Caso: Account CMR Number","Orden de trabajo: Caso: Account Name Text","TSE: Status","TSE: Start Time","TSE: End Time","Duration in Hours","WO: Subject"];
  columnasSTE:string[]=["Session Time Unique ID","Session Time Support Agent Country","Número del caso","Session Time Creator Employee Serial Number","Account CMR Number","Nombre de la cuenta: Nombre de la cuenta","Start Date/Time","End Date/Time","Session Time: Total Duration","Case Subject"];
  columnasexcelWorkdayG:string[]=["Employee ID","Worker","Time Type","Reported Date","Calculated Quantity","Status"];
  pais = new FormControl('');
  MListCountry: MCountryEntity[];
  MListGMT: MGmt[];
  mSummary: MSummary;
  mSummaryFinal: MSummaryFinal;
  mResponseLoadGuid:MResponseLoadGuid;
  intervalSubscriptionFiles: Subscription | undefined;

  constructor(private storageService: StorageService, private loadArpExcelService: LoadArpExcelService,private apiListCountry: ListCountryService,) {
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.MListCountry = [];
    this.MListGMT = [];
    this.mSummary = {} as MSummary;
    this.mSummaryFinal = {} as MSummaryFinal;
    this.mResponseLoadGuid = {} as MResponseLoadGuid;
    this.porcentajeCarga=0;
  }
  ngOnInit() {
    console.log('Datos ' , this.botonARP , this.botonTSE , this.botonSTE);
    this.validateRole();
    this.consultcountries();
    this.cargaGMT();
  }
  cargaGMT() {
    //this.MListGMT.push({id:1, time:'(GMT-01:00) Azores',diferencia:-1,paisGMT:""});
    //this.MListGMT.push({id:2, time:'(GMT-01:00) Cape Verde Island',diferencia:-1,paisGMT:""});
    //this.MListGMT.push({id:3, time:'(GMT-02:00) Mid-Atlantic',diferencia:-2,paisGMT:""});
    //this.MListGMT.push({id:4, time:'(GMT-03:00) Brasilia',diferencia:-3,paisGMT:""});
    this.MListGMT.push({id:5, time:'(GMT-03:00) Argentina',diferencia:-3,paisGMT:"Argentina"});
    this.MListGMT.push({id:5, time:'(GMT-03:00) Uruguay',diferencia:-3,paisGMT:"Uruguay"});
    //this.MListGMT.push({id:6, time:'(GMT-03:00) Greenland',diferencia:-3,paisGMT:""});
    //this.MListGMT.push({id:7, time:'(GMT-03:30) Newfoundland and Labrador',diferencia:-3.5,paisGMT:""});
    //this.MListGMT.push({id:8, time:'(GMT-04:00) Atlantic Time (Canada)',diferencia:-4,paisGMT:""});
    this.MListGMT.push({id:9, time:'(GMT-04:00) Venezuela',diferencia:-4,paisGMT:"Venezuela"});
    //this.MListGMT.push({id:10, time:'(GMT-04:00) Manaus',diferencia:-4});
    this.MListGMT.push({id:11, time:'(GMT-04:00) Chile',diferencia:-4,paisGMT:"Chile"});
    this.MListGMT.push({id:12, time:'(GMT-05:00) Colombia',diferencia:-5,paisGMT:"Colombia"});
    this.MListGMT.push({id:12, time:'(GMT-05:00) Peru',diferencia:-5,paisGMT:"Peru"});
    this.MListGMT.push({id:12, time:'(GMT-05:00) Ecuador',diferencia:-5,paisGMT:"Ecuador"});
    //this.MListGMT.push({id:13, time:'(GMT-05:00) Eastern Time (US and Canada) ',diferencia:-5});
    //this.MListGMT.push({id:14, time:'(GMT-05:00) Indiana (East) ',diferencia:-5});
    //this.MListGMT.push({id:15, time:'(GMT-06:00) Central America ',diferencia:-6});
    //this.MListGMT.push({id:16, time:'(GMT-06:00) Central Time (US and Canada)',diferencia:-6});
    this.MListGMT.push({id:17, time:'(GMT-06:00) México ',diferencia:-6,paisGMT:"Mexico"});
    //this.MListGMT.push({id:18, time:'(GMT-06:00) Saskatchewan',diferencia:-6});
    //this.MListGMT.push({id:19, time:'(GMT-07:00) Arizona',diferencia:-7});
    //this.MListGMT.push({id:20, time:'(GMT-07:00) Chihuahua, La Paz, Mazatlan ',diferencia:-7,paisGMT:""});
    //this.MListGMT.push({id:21, time:'(GMT-07:00) Mountain Time (US and Canada)',diferencia:-7});
    //this.MListGMT.push({id:22, time:'(GMT-08:00) Pacific Time (US and Canada); Tijuana ',diferencia:-8,paisGMT:""});
    //this.MListGMT.push({id:23, time:'(GMT-09:00) Alaska',diferencia:-9});
    //this.MListGMT.push({id:24, time:'(GMT-10:00) Hawaii',diferencia:-10});
    //this.MListGMT.push({id:25, time:'(GMT-11:00) Midway Island, Samoa',diferencia:-11});
    //this.MListGMT.push({id:26, time:'(GMT) Casablanca, Monrovia',diferencia:0});
    //this.MListGMT.push({id:27, time:'(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',diferencia:0});
    //this.MListGMT.push({id:28, time:'(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',diferencia:1});
    //this.MListGMT.push({id:29, time:'(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',diferencia:1});
    //this.MListGMT.push({id:30, time:'(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',diferencia:1});
    //this.MListGMT.push({id:31, time:'(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',diferencia:1});
    //this.MListGMT.push({id:32, time:'(GMT+01:00) West Central Africa ',diferencia:1});
    //this.MListGMT.push({id:33, time:'(GMT+02:00) Athens, Bucharest, Istanbul',diferencia:2});
    //this.MListGMT.push({id:34, time:'(GMT+02:00) Cairo',diferencia:2});
    //this.MListGMT.push({id:35, time:'(GMT+02:00) Harare, Pretoria ',diferencia:2});
    //this.MListGMT.push({id:36, time:'(GMT+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius',diferencia:2});
    //this.MListGMT.push({id:37, time:'(GMT+02:00) Jerusalem',diferencia:2});
    //this.MListGMT.push({id:38, time:'(GMT+02:00) Minsk',diferencia:2});
    //this.MListGMT.push({id:39, time:'(GMT+02:00) Windhoek',diferencia:2});
    //this.MListGMT.push({id:40, time:'(GMT+03:00) Baghdad',diferencia:3});
    //this.MListGMT.push({id:41, time:'(GMT+03:00) Kuwait, Riyadh',diferencia:3});
    //this.MListGMT.push({id:42, time:'(GMT+03:00) Moscow, St. Petersburg, Volgograd ',diferencia:3});
    //this.MListGMT.push({id:43, time:'(GMT+03:00) Nairobi',diferencia:3});
    //this.MListGMT.push({id:44, time:'(GMT+03:30) Tehran',diferencia:3.5});
    //this.MListGMT.push({id:45, time:'(GMT+04:00) Abu Dhabi, Muscat ',diferencia:4});
    //this.MListGMT.push({id:46, time:'(GMT+04:00) Baku',diferencia:4});
    //this.MListGMT.push({id:47, time:'(GMT+04:00) Tblisi',diferencia:4});
    //this.MListGMT.push({id:48, time:'(GMT+04:00) Yerevan',diferencia:4});
    //this.MListGMT.push({id:49, time:'(GMT+04:30) Kabul',diferencia:4.5});
    //this.MListGMT.push({id:50, time:'(GMT+05:00) Ekaterinburg',diferencia:5});
    //this.MListGMT.push({id:51, time:'(GMT+05:00) Islamabad, Karachi, Tashkent ',diferencia:5});
    //this.MListGMT.push({id:52, time:'(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',diferencia:5.5});
    //this.MListGMT.push({id:53, time:'(GMT+05:45) Kathmandu',diferencia:5.75});
    //this.MListGMT.push({id:54, time:'(GMT+06:00) Almaty, Novosibirsk',diferencia:6});
    //this.MListGMT.push({id:55, time:'(GMT+06:00) Astana, Dhaka',diferencia:6});
    //this.MListGMT.push({id:56, time:'(GMT+06:00) Sri Jayawardenepura',diferencia:6});
    //this.MListGMT.push({id:57, time:'(GMT+06:30) Yangon (Rangoon)',diferencia:6.5});
    //this.MListGMT.push({id:58, time:'(GMT+07:00) Bangkok, Hanoi, Jakarta',diferencia:7});
    //this.MListGMT.push({id:59, time:'(GMT+07:00) Krasnoyarsk',diferencia:7});
    //this.MListGMT.push({id:60, time:'(GMT+08:00) Beijing, Chongqing, Hong Kong SAR, Urumqi',diferencia:8});
    //this.MListGMT.push({id:61, time:'(GMT+08:00) Irkutsk, Ulaanbaatar',diferencia:8});
    //this.MListGMT.push({id:62, time:'(GMT+08:00) Kuala Lumpur, Singapore',diferencia:8});
    //this.MListGMT.push({id:63, time:'(GMT+08:00) Perth',diferencia:8});
    //this.MListGMT.push({id:64, time:'(GMT+08:00) Taipei',diferencia:8});
    //this.MListGMT.push({id:65, time:'(GMT+09:00) Osaka, Sapporo, Tokyo',diferencia:9});
    //this.MListGMT.push({id:66, time:'(GMT+09:00) Seoul',diferencia:9});
    //this.MListGMT.push({id:67, time:'(GMT+09:00) Yakutsk',diferencia:9});
    //this.MListGMT.push({id:68, time:'(GMT+09:30) Adelaide',diferencia:9.5});
    //this.MListGMT.push({id:69, time:'(GMT+09:30) Darwin',diferencia:9.5});
    //this.MListGMT.push({id:70, time:'(GMT+10:00) Brisbane',diferencia:10});
    //this.MListGMT.push({id:71, time:'(GMT+10:00) Canberra, Melbourne, Sydney ',diferencia:10});
    //this.MListGMT.push({id:72, time:'(GMT+10:00) Guam, Port Moresby',diferencia:10});
    //this.MListGMT.push({id:73, time:'(GMT+10:00) Hobart',diferencia:10});
    //this.MListGMT.push({id:74, time:'(GMT+10:00) Vladivostok',diferencia:10});
    //this.MListGMT.push({id:75, time:'(GMT+11:00) Magadan, Solomon Islands, New Caledonia',diferencia:11});
    //this.MListGMT.push({id:76, time:'(GMT+12:00) Auckland, Wellington ',diferencia:12});
    //this.MListGMT.push({id:77, time:'(GMT+12:00) Fiji Islands, Kamchatka, Marshall Islands',diferencia:12});
    //this.MListGMT.push({id:78, time:'(GMT+13:00) Nuku alofa',diferencia:13});

  }

  readExcel(file1: any, file2: any, file3: any) {

    
    if (this.validarArchivo(file1) && this.validarArchivo(file2) && this.validarArchivo(file3)) {
      this.barraProgreso(true);
      console.log('Incia proceso');
      this.readfilefinal(file1.files,file2.files,file3.files);
      this.barraProgreso(false)
    } else {
      console.log('Error: Uno o más archivos no pasaron la validación');
      this.barraProgreso(false)
    }
    
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
    console.log('Barra ' + estatus);
      //this.activarBarra = !estatus;
      this.botonARP = !estatus;
      this.botonSTE = !estatus;
      this.botonTSE = !estatus;
      this.botonHorario=!estatus;
      this.botonWorkdayG=!estatus;
      if(!estatus){
        this.fileInput1.nativeElement.value = null;
        this.fileInput2.nativeElement.value = null;
        this.fileInput3.nativeElement.value = null;
        this.fileInput4.nativeElement.value = null;
        this.fileInputWorkdayG.nativeElement.value=null;

      }
     

     
 // }, 4 * 60 * 1000);
  }

  activarARP(boton: string,fileEvent: any){
    const file = fileEvent.target.files[0];
    const typeFile = file.type.split('/');
    const filemb: number = file.size / 1024;
    switch (boton){
      case 'ARP':
        this.botonARP = true; 
        // if (filemb<= 10) {
        //   this.botonARP = false;
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Oopss ',
        //     text: 'Error: El archivo no contiene información, por favor verifica!',
        //     confirmButtonColor: '#0A6EBD',
        //   });
        // } else {
        //   switch (file.name) {
        //     case "PORTAL_ARP.xlsx":
        //       this.botonARP = true;                
        //       break;
        //     case "PORTAL_ARP.xls":
        //       this.botonARP = true;                
        //       break;
        //     default:
        //       this.botonARP = false;
        //       Swal.fire({
        //         icon: 'error',
        //         title: 'Oopss ',
        //         text: 'Error: El archivo no es válido, ingresa sólo el archivo "PORTAL_ARP"!',
        //         confirmButtonColor: '#0A6EBD',
        //       });
        //       break;
        //   }
        // }
        
        
        return 
      case 'TSE':
        this.botonTSE = true;
        // if (filemb<= 10) {
        //   this.botonTSE = false;
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Oopss ',
        //     text: 'Error: El archivo no contiene información, por favor verifica!',
        //     confirmButtonColor: '#0A6EBD',
        //   });
        // } else {
        //   switch (file.name) {
        //     case "PORTAL_TSE.xlsx":
        //       this.botonTSE = true;                
        //       break;
        //     case "PORTAL_TSE.xls":
        //       this.botonTSE = true;                
        //       break;
        //     default:
        //       this.botonTSE = false;
        //       Swal.fire({
        //         icon: 'error',
        //         title: 'Oopss ',
        //         text: 'Error: El archivo no es válido, ingresa sólo el archivo "PORTAL_TSE"!',
        //         confirmButtonColor: '#0A6EBD',
        //       });
        //       break;
        //   }
          
        // }
        return
      case 'STE':
        this.botonSTE = true;                
        // if (filemb<= 3) {
        //   this.botonSTE = false;
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Oopss ',
        //     text: 'Error: El archivo no contiene información, por favor verifica!',
        //     confirmButtonColor: '#0A6EBD',
        //   });
        // } else {
        //   switch (file.name) {
        //     case "PORTAL_STE.xlsx":
              
        //       break;
        //     case "PORTAL_STE.xls":
        //       this.botonSTE = true;                
        //       break;
        //     default:
        //       this.botonSTE = false;
        //       Swal.fire({
        //         icon: 'error',
        //         title: 'Oopss ',
        //         text: 'Error: El archivo no es válido, ingresa sólo el archivo "PORTAL_STE"!',
        //         confirmButtonColor: '#0A6EBD',
        //       });
        //       break;
        //   }
          
        // }
        return
      case 'Horario':
        this.botonHorario = true;
        return
      case 'WorkdayG':
        this.botonWorkdayG = true;
        return
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

  readFileWorkdayG(fileInput: any) {
    let file = fileInput[0]; // Accede al primer archivo seleccionado

    if (file) {
      let fileReader = new FileReader();

      fileReader.readAsBinaryString(file);

      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary' });
        var sheetNames = workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
        let valiFile = true;
        this.columnasexcelWorkdayG.forEach(element => {
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
          this.fileInputWorkdayG.nativeElement.value = null;
          this.activarBarra = false;
        }else{
          let XL_row_object = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
          let json_object = JSON.stringify(XL_row_object);
          // aqui parseamos a json
          const datos = JSON.parse(json_object);
          console.log(this.ExcelData);
          if(this.ExcelData.length){

            console.log(this.ExcelData);
            this.loadArpExcelService.PostLoadHorariosWorkdayG(this.ExcelData).subscribe(data => {
              console.log(data);
              if(data){
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
              }
            });
            
            console.log("El archivo pasa")
            this.botonWorkdayG = false;
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error:  Archivo vacio.',
              confirmButtonColor: '#0A6EBD',
            });
            this.botonWorkdayG = false;
          }
        }
        

        
      }
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }
 
  readfilefinal(fileInput: any,fileInput2: any,fileInput3: any){

    let file = fileInput[0]; // Accede al primer archivo seleccionado
    let file2 =  fileInput2[0];
    let file3 =  fileInput3[0];
    let idCarga='00000000-0000-0000-0000-000000000000';

    if (file && file2 && file3) 
    {
      let fileReader = new FileReader();
      let fileReader1 = new FileReader();
      let fileReader2 = new FileReader();

      fileReader.readAsBinaryString(file);
      
      

      fileReader.onload = (e) => {
          var workBook = XLSX.read(fileReader.result, { type: 'binary' });
          var sheetNames = workBook.SheetNames;
          this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });

          if (file.name == "PORTAL_ARP.xlsx" || file.name == "PORTAL_ARP.xls"){
            if(this.ExcelData.length > 0){
              let valiFile = true;
              this.columnasARP.forEach(element => {
                if (this.ExcelData[0][element]==undefined) {
                  valiFile=false; 
                }   
              });
              if (!valiFile) {
                this.fileInput1.nativeElement.value = null;
                this.activarBarra = false;
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'El archivo ARP es inválido por favor verifique: \n * Columnas incorrectas',
                  confirmButtonColor: '#0A6EBD',
                });
                
              }else{

                 console.log('inicia carga');
                 console.log(this.pais.value);
                 console.log('--------------');
                var valpais = this.pais.value?.toString();
                //var idCarga = '00000000-0000-0000-0000-000000000000' as unknown as Guid;


                //Get idCarga
                this.loadArpExcelService.GetCarga().subscribe( data => { 
                    console.log(data);
                    this.mResponseLoadGuid=data;
                    idCarga = data.data;
                    console.log("idCarga:::::ARP");
                    console.log(idCarga);


                    
                  this.activarBarra = true;
                    this.intervalSubscriptionFiles = interval(5000).subscribe(() => {
                      this.barraProgreso(true);
                      this.loadArpExcelService.GetCargaAvance(idCarga).subscribe((data) => {
                        console.log(data);
                        if(data){
                          if(data.statusCode == 201 || data.statusCode == 200){
                            this.porcentajeCarga = data.data.total;
                            if(this.porcentajeCarga >= 100){
                              this.unsubscribeIntervalSubscriptionFiles();
                              this.porcentajeCarga = 0;
                            }
                          }else{
                            Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Error en el servidor, favor validar!',
                              confirmButtonColor: '#0A6EBD',
                            });
                          }
                        }else{
                          Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error al intentar consultar el progreso de su carga!',
                            confirmButtonColor: '#0A6EBD',
                          });
                        }
                      });
                      
                    });

                    this.activarBarra = false;


                      //carga ARP
                      this.loadArpExcelService.UploadARP(this.ExcelData,valpais!,idCarga!).subscribe( data => { 
                      console.log(data);
                      this.mResponseLoadGuid=data;
                      idCarga = data.data;
      
                      console.log("idCarga:::::ARP");
                      console.log(idCarga);

                      this.showImgARP=true;
                      fileReader1.readAsBinaryString(file2);
                      });  
  
                 
                  });  


                  
              }

            }else{
              this.fileInput1.nativeElement.value = null;
              this.activarBarra = false;
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El archivo ARP no contiene información, por favor verifique!',
                confirmButtonColor: '#0A6EBD',
              });
            }

          }else{
            this.fileInput1.nativeElement.value = null;
            this.activarBarra = false;
            Swal.fire({
                icon: 'error',
                title: 'Oopss ',
                text: 'Error: El archivo no es válido, ingresa sólo el archivo "PORTAL_ARP"!',
                confirmButtonColor: '#0A6EBD',
            });
          }
      }




      fileReader1.onload = (e) => {
        var workBook1 = XLSX.read(fileReader1.result, { type: 'binary' });
        var sheetNames1 = workBook1.SheetNames;
        this.ExcelData1 = XLSX.utils.sheet_to_json(workBook1.Sheets[sheetNames1[0]], { raw: false });

        if (file2.name == "PORTAL_TSE.xlsx" || file2.name == "PORTAL_TSE.xls"){
          if(this.ExcelData1.length > 0){
            let valiFile = true;
            this.columnasTSE.forEach(element => {
              if (this.ExcelData1[0][element]==undefined) {
                valiFile=false; 
              }   
            });
            if (!valiFile) {
              this.fileInput2.nativeElement.value = null;
              this.activarBarra = false;
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El archivo TSE es inválido por favor verifique: \n * Columnas incorrectas',
                confirmButtonColor: '#0A6EBD',
              });
              
            }else{
              // console.log(this.ExcelData);
              var valpais = this.pais.value?.toString();

              this.loadArpExcelService.UploadTSE(this.ExcelData1,valpais!,idCarga!).subscribe( data => { 
              console.log(data);
              this.mResponseLoadGuid=data;
                idCarga = data.data;
                console.log("idCarga:::::TSE");
                console.log(idCarga);
                
              this.showImgARP=true;
              fileReader2.readAsBinaryString(file3);
              });
              
            }

          }else{
            this.fileInput2.nativeElement.value = null;
            this.activarBarra = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El archivo TSE no contiene información, por favor verifique!',
              confirmButtonColor: '#0A6EBD',
            });
          }

        }else{
          this.fileInput2.nativeElement.value = null;
          this.activarBarra = false;
          Swal.fire({
              icon: 'error',
              title: 'Oopss ',
              text: 'Error: El archivo no es válido, ingresa sólo el archivo "PORTAL_TSE"!',
              confirmButtonColor: '#0A6EBD',
          });
        }
      }



      fileReader2.onload = (e) => {
        var workBook2 = XLSX.read(fileReader2.result, { type: 'binary' });
        var sheetNames2 = workBook2.SheetNames;
        this.ExcelData2 = XLSX.utils.sheet_to_json(workBook2.Sheets[sheetNames2[0]], { raw: false });

        if (file3.name == "PORTAL_STE.xlsx" || file3.name == "PORTAL_STE.xls"){
          if(this.ExcelData2.length > 0){
            let valiFile = true;
            this.columnasSTE.forEach(element => {
              if (this.ExcelData2[0][element]==undefined) {
                valiFile=false; 
              }   
            });
            if (!valiFile) {
              this.fileInput3.nativeElement.value = null;
              this.activarBarra = false;
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El archivo STE es inválido por favor verifique: \n * Columnas incorrectas',
                confirmButtonColor: '#0A6EBD',
              });
              
            }else{
              // console.log(this.ExcelData);
              var valpais = this.pais.value?.toString();

              this.loadArpExcelService.UploadSTE(this.ExcelData2,valpais!,idCarga!).subscribe( data => { 
              console.log(data)
              this.mSummary = data;

              console.log("idCarga:::::STE");
              console.log(idCarga);

              this.showImgARP=true;
              //this.activarBarra = false;
              var soloNotificaciones=false;
              this.fileInput3.nativeElement.value = null;
              if (this.mSummary.data.eN_PROCESO_ARP=="0" && this.mSummary.data.eN_PROCESO_STE=="0" && this.mSummary.data.eN_PROCESO_TSE =="0" ){
                soloNotificaciones=true;
              }

                  Swal.fire({
                    icon: 'success',
                    title: this.mSummary.data.mensaje,
                    allowOutsideClick:false,
                    html: `
                    <span>Resumen de la ejecucion:</span>
                    <span>` +this.mSummary.data.idCarga+`</span>
                    <hr/>
                    <br>
                    <ol style='font-size: small;'>

                      <li>Carga ARP <b>(` +this.mSummary.data.arP_CARGA+`)</b></li>
                      <li>Carga STE <b>(` +this.mSummary.data.stE_CARGA+`)</b></li>
                      <li>Carga TSE <b>(` +this.mSummary.data.tsE_CARGA+`)</b></li>
                      <br/>
                      <br/>
                      <li>Overtime ARP <b>(` +this.mSummary.data.eN_PROCESO_ARP+`)</b></li>
                      <li>Overtime STE <b>(` +this.mSummary.data.eN_PROCESO_STE+`)</b></li>
                      <li>Overtime TSE <b>(` +this.mSummary.data.eN_PROCESO_TSE+`)</b></li>
                      <br/>
                      <li>ARP omitidos por Duplicidad <b>(` +this.mSummary.data.arpOmitidosXDuplicidad+`)</b></li>
                      <li>STE omitidos por Duplicidad <b>(` +this.mSummary.data.steOmitidosXDuplicidad+`)</b></li>
                      <li>TSE omitidos por Duplicidad <b>(` +this.mSummary.data.tseOmitidosXDuplicidad+`)</b></li>
                      <br/>
                      <li>No aplica por horario ARP <b>(` +this.mSummary.data.nO_APLICA_X_HORARIO_ARP+`)</b></li>
                      <li>No aplica por horario STE <b>(` +this.mSummary.data.nO_APLICA_X_HORARIO_STE+`)</b></li>
                      <li>No aplica por horario TSE <b>(` +this.mSummary.data.nO_APLICA_X_HORARIO_TSE+`)</b></li>
                      <br/>
                      <li>No aplica por overlaping ARP <b>(` +this.mSummary.data.nO_APLICA_X_OVERLAPING_ARP+`)</b></li>
                      <li>No aplica por overlaping STE <b>(` +this.mSummary.data.nO_APLICA_X_OVERLAPING_STE+`)</b></li>
                      <li>No aplica por overlaping TSE <b>(` +this.mSummary.data.nO_APLICA_X_OVERLAPING_TSE+`)</b></li>
                      <br/>
                      <li>No aplica por politica overtime ARP <b>(` +this.mSummary.data.nO_APLICA_X_OVERTIME_ARP+`)</b></li>
                      <li>No aplica por politica overtime STE <b>(` +this.mSummary.data.nO_APLICA_X_OVERTIME_STE+`)</b></li>
                      <li>No aplica por politica overtime TSE <b>(` +this.mSummary.data.nO_APLICA_X_OVERTIME_TSE+`)</b></li>
                      
                      <br/>
                      <li>Reportes con datos inválidos ARP <b>(` +this.mSummary.data.arpxDatosNovalidos+`)</b></li>
                      <li>Reportes con datos inválidos STE <b>(` +this.mSummary.data.stexDatosNovalidos+`)</b></li>
                      <li>Reportes con datos inválidos TSE <b>(` +this.mSummary.data.tsexDatosNovalidos+`)</b></li>
                      * Reportes sin hora inicio, fin o de otros paises no contemplados.                                                     
                    </ol> 
                        `,
                    confirmButtonColor: '#0A6EBD',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: soloNotificaciones ? 'Notificar hallazgos' :'Continuar proceso' , 
                    cancelButtonText:'Cancelar carga' 
                  }).then((willDelete) => {

                    if(willDelete.value){

                      //Si las tres variables de carga OK vienen en 0 (Cero), se manda directamente a Notificaciones

                      if (soloNotificaciones ) {
                          this.loadArpExcelService.NotificacionesProceso(idCarga.toString()).subscribe( data => { 
                            console.log(data)
                            //this.mSummary = data;
              
                            this.showImgARP=true;
                            this.activarBarra = false;
                            });
                         } else {
                          this.loadArpExcelService.ValidaLimitesExcepcionesOverlapping(idCarga.toString()).subscribe( data => { 
                            console.log(data)
                            this.mSummaryFinal=data;
                            
                            Swal.fire({
                              icon: 'success',
                              title: this.mSummaryFinal.data.mensaje,
                              allowOutsideClick:false,
                              html: `
                              <span>Resumen de la ejecucion:</span>
                              <span>` +idCarga.toString()+`</span>
                              <hr/>
                              <br>
                              <ol style='font-size: small;'>
                                <li>Registros Insertados en PortalDB <b>(` +this.mSummaryFinal.data.registroS_PORTALDB+`)</b></li>
                                <br/>
                                <li>No aplica por overlaping ARP <b>(` +this.mSummaryFinal.data.nO_APLICA_X_OVERLAPING_ARP+`)</b></li>
                                <li>No aplica por overlaping STE <b>(` +this.mSummaryFinal.data.nO_APLICA_X_OVERLAPING_STE+`)</b></li>
                                <li>No aplica por overlaping TSE <b>(` +this.mSummaryFinal.data.nO_APLICA_X_OVERLAPING_TSE+`)</b></li>
                                <br/>
                                <br/>
                              </ol> 
                                  `,
                              confirmButtonColor: '#0A6EBD',
                              showConfirmButton: true,
                              confirmButtonText:'Generar notificaciones' , 
                            });


                            this.loadArpExcelService.NotificacionesProceso(idCarga.toString()).subscribe( data => { 
                              console.log(data)
                              //this.mSummary = data;
                
                              this.showImgARP=true;
                              
                              });
              
                            this.showImgARP=true;
                            this.activarBarra = false;
                            });
                         }

                          
                          

                         //-----------------------------------------------------------
                    }else{
                      //no acepta carga;
                      //-----------------------------------------------------------
                      //sigue activa la carga anterior
                      //-----------------------------------------------------------
                      this.activarBarra = false;
                      this.fileInput3.nativeElement.value = null;
                    }
            
                  console.log(willDelete)
                });
              
              });
           
            }

          }else{
            this.fileInput3.nativeElement.value = null;
            this.activarBarra = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El archivo STE no contiene información, por favor verifique!',
              confirmButtonColor: '#0A6EBD',
            });
          }

        }else{
          this.fileInput2.nativeElement.value = null;
          this.activarBarra = false;
          Swal.fire({
              icon: 'error',
              title: 'Oopss ',
              text: 'Error: El archivo no es válido, ingresa sólo el archivo "PORTAL_STE"!',
              confirmButtonColor: '#0A6EBD',
          });
        }        
      }

    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }

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

  readExcelWorkdayG(file: any) {
    if (this.validarArchivo(file)) {
      this.barraProgreso(true);
      this.readFileWorkdayG(file.files);
    } else {
      console.log('Error: Uno o más archivos no pasaron la validación');
      this.barraProgreso(false);
    }
   // this.barraProgreso()
  }

  select(selPais: any) {
    console.log(selPais.value);
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


}

