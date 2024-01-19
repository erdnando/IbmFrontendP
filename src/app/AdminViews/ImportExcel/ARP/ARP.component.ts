import { Component, ViewChild } from "@angular/core";
import { StorageService } from "src/app/Service/storage-service/storage.service";
import { LoadArpExcelService } from "src/app/AdminViews/ImportExcel/services/LoadArpExcel/LoadArpExcel.service"
import * as XLSX from 'xlsx';
import { FormControl } from "@angular/forms";
import { MUserEntity } from 'src/app/Models/MUserEntity';
import Swal from "sweetalert2";



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
  
  


  constructor(private storageService: StorageService, private loadArpExcelService: LoadArpExcelService) {
    this.MUser = this.storageService.obtenerDatosMapeados();

  }
  ngOnInit() {
    this.validateRole();
  }

  readExcel(file1: any, file2: any, file3: any) {
    // this.readFile(file1.files);
    // this.readFile2(file2.files);
    // this.readFile3(file3.files);
    
    if (this.validarArchivo(file1) && this.validarArchivo(file2) && this.validarArchivo(file3)) {
      this.barraProgreso(true);
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
      this.activarBarra = !estatus;
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

  // readFile(fileInput: any[]) {

  //   this.excelData1 = [];
  //   this.excelData2 = [];
  //   this.excelData3 = [];

  //   for(let i = 0; i < fileInput.length; i++){
  //     let files = fileInput[i];
  //     let file = files[0];
  //     let count = i + 1;

  //   if (file) {

  //     let fileReader = new FileReader();

  //     fileReader.readAsBinaryString(file);

  //     fileReader.onload = (e) => {
  //       var workBook = XLSX.read(fileReader.result, { type: 'binary' });
  //       var sheetNames = workBook.SheetNames;
  //       this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
  //       console.log(this.ExcelData);


  //       if(this.ExcelData.length){
  //         console.log(count)
  //          if(count === 1)
  //          {
  //           this.excelData1 = this.ExcelData;
  //           console.log(this.excelData1)
  //          } 
  //          else if( count === 2)
  //          {
  //           this.excelData2 = this.ExcelData;
  //          }
  //           else if( count === 3){
  //           this.excelData3 = this.ExcelData;

  //           if(this.excelData1.length && this.excelData2.length && this.excelData3.length){
  //             // envia el primer excel
  //             console.log(this.excelData1)
  //             this.loadArpExcelService.PostLoad1(this.excelData1).subscribe(data => {
  //               console.log(data);
  //             });
  //             //envia el segundo excel
  //             console.log(this.excelData2)
  //             this.loadArpExcelService.PostLoad2(this.excelData2).subscribe(data => {
  //               console.log(data);
  //             });
  //             // envia el tercer excel
  //             console.log(this.excelData3)
  //             this.loadArpExcelService.PostLoad3(this.excelData3).subscribe(data => {
  //               console.log(data);
  //             });
  //             this.barraProgreso();
        
  //             console.log('archivos enviados')
  //           }
  //          }

           
          
  //       }else{
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'Error:  Se ha seleccionado un archivo vacio.',
  //           confirmButtonColor: '#0A6EBD',
  //         });
  //         return
  //       }
  //     }
  //   } else {
  //     console.error("No se ha seleccionado ningún archivo.");
  //   }
  // }
  // }


 /* readFile2(fileInput2: any) {
    let file = fileInput2[0]; // Accede al primer archivo seleccionado

    if (file) {
      let fileReader = new FileReader();

      fileReader.readAsBinaryString(file);

      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary' });
        var sheetNames = workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
        console.log(this.ExcelData);
        if(this.ExcelData.length){
          this.loadArpExcelService.PostLoad2(this.ExcelData).subscribe(data => {
            console.log(data);
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error:  Se ha seleccionado un archivo vacio.',
          });
          this.botonHorario = false;
        }
      }
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }

  readFile3(fileInput3: any) {
    let file = fileInput3[0]; // Accede al primer archivo seleccionado

    if (file) {
      let fileReader = new FileReader();

      fileReader.readAsBinaryString(file);

      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary' });
        var sheetNames = workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
        console.log(this.ExcelData);
        if(this.ExcelData.length){
          this.loadArpExcelService.PostLoad3(this.ExcelData).subscribe(data => {
            console.log(data);
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error:  Se ha seleccionado un archivo vacio.',
          });
          this.botonHorario = false;
        }
      }
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }
  */

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
                // console.log(this.ExcelData);
                this.loadArpExcelService.UploadARP(this.ExcelData).subscribe( data => { 
                console.log(data)
                this.showImgARP=data;
                fileReader1.readAsBinaryString(file2);
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
              this.loadArpExcelService.UploadARP(this.ExcelData).subscribe( data => { 
              console.log(data)
              this.showImgARP=data;
              fileReader2.readAsBinaryString(file2);
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
              this.loadArpExcelService.UploadARP(this.ExcelData).subscribe( data => { 
              console.log(data)
              this.showImgARP=data;
              this.activarBarra = false;
              this.fileInput3.nativeElement.value = null;
                  Swal.fire({
                    icon: 'success',
                    title: 'Carga de archivos completada.',
                    confirmButtonColor: '#0A6EBD',
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

  


}

