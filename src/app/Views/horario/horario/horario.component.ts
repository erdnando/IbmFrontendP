import { Component, ViewChild } from '@angular/core';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { FormControl } from '@angular/forms';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { MCreateHorario, MCreateHorarioEditable } from 'src/app/Models/MHorario';
import { ListCountryService } from 'src/app/AdminViews/AdminCountries/services/list-country/list-country.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { HorarioCreateService } from '../../parameters/services/horarioCreate/horario-create.service';
import { UserConsultByCodeEmService } from '../../user/services/userConsultByCodeEm/user-consult-by-code-em.service';
import { LoadArpExcelService } from 'src/app/AdminViews/ImportExcel/services/LoadArpExcel/LoadArpExcel.service';
import { HorarioService } from 'src/app/Service/horario/horario.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent {

  @ViewChild('fileInputHorario') fileInputHorario: any;
  @ViewChild('downloadTemplateEl') downloadTemplateEl: any;
  
  WeekTemplate = [
    { day: 'Domingo', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Lunes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Martes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Miércoles', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Jueves', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Viernes', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Sábado', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
  ];
  
  columnasAMostrar = ['dias', 'inicio','a', 'fin'];
  columnasAMostrar2 = ['dias', 'inicio','a', 'fin'];

  MUser: any;
  columnasexcel:string[]=["#", "NOMBRE DIA", "HORA INICIO", "HORA FIN", "FECHA", "CODIGO EMP", "PAIS"];

  MListCountry: MCountryEntity[];
  ExcelData: any;


  pais = new FormControl('');//OK
  hayHorario: boolean = false;//OK
  idPaisSeleccionado: string = '';
  nPaisSeleccionado: string = '';
  agregarHorariosexcel: boolean = false;
  fesitvosExcel: any[] = [];
  horaInicio = new FormControl('');
  horaFin = new FormControl('');
  horaInicio2 = new FormControl('');//clonado
  horaFin2 = new FormControl('');//clonado
  codeEmployed = new FormControl("");
  fechaSeleccionada = new FormControl(null);
  confirmedControl = new FormControl(true);
  valoresInicio: { [dia: string]: string[] } = {};
  mHorario: MCreateHorarioEditable;
  mHorario2: MCreateHorario;//clonado
  arrHorarioEmpleado: MCreateHorarioEditable[] = [];//OK
  mHoraioConsult: MCreateHorario[] = [];
  semanaAno: string = '';
  idUserByEmployeCode: string = '';
  fechaSemanaAno: string = "";
  mHorarioVista: any[] = [];
  nuevoHorario2: any[] = [];//clonado
  arrHoraInicio: any[] = [];
  HoraInicio2: any[] = [];//clonado
  arrHoraFin: any[] = [];
  listHoraFin2: any[] = [];//clonado
  tabSelected: string = "0";

  
  constructor(

    private storageFestivos: StorageService,
    private serviceList: ObtenerlistaService,
    private apiListCountry: ListCountryService,
    private horarioCreate: HorarioCreateService,
    private consultUserByEmployee: UserConsultByCodeEmService,
    private loadArpExcelService: LoadArpExcelService,
    private horarioService: HorarioService,
  ) {
    this.MListCountry = [];
    this.mHorario = {} as MCreateHorarioEditable;
    this.mHorario2 = {} as MCreateHorario;//clonado
    this.MUser = this.storageFestivos.obtenerDatosMapeados();
  }
  
 

  ngOnInit():void{
      this.consultcountries();//ok
      this.resetStructures();
    }

    
    //-------------------------COMUNES---------------------------------------------------------------------------------

    //Get country list that full country dropDownList based on roles
    consultcountries() {
      // SERVICIO PARA TRAER LA LISTA DE PAISES
      this.apiListCountry
        .GetCountry().pipe(map((data: MiObjeto) => data)).subscribe((data) => {
          let lista = data['data'];
  
          let MListCountryFilter = lista.filter((x: any) => x.idCounty == this.MUser.countryEntityId);
          console.log('Rol',this.MUser.rolEntity.nameRole);
  
          if (this.MUser.rolEntity.nameRole == 'Super Administrador') {
            this.MListCountry = lista;
  
          }else if (this.MUser.rolEntity.nameRole == 'Administrador') {
            this.MListCountry = MListCountryFilter;
  
          }else if (this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2') {
            this.MListCountry = lista;
  
          }else if (this.MUser.rolEntity.nameRole == 'Usuario Aprobador N1') {
            this.MListCountry = lista;
          }
        });
  
    
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

    resetStructures(){
      this.codeEmployed.reset();
      this.fechaSeleccionada.reset();
      this.arrHorarioEmpleado = [];
      this.mHorarioVista=[];
      this.semanaAno='';
      this.arrHoraInicio=[];
      this.arrHoraFin=[];
    }

    resetSimple(){
      
      this.arrHorarioEmpleado = [];
      this.mHorarioVista=[];
      
      this.arrHoraInicio=[];
      this.arrHoraFin=[];
    }

//----------------------------FILTERS------------------------------------------------------------------------------
    //Detect valid employee and get his schedules
    searchEmployee(event: any) {

      let codeEmploye = (event.target as HTMLInputElement).value;

      this.consultUserByEmployee.GetUserIdByEmployeCode(codeEmploye, this.pais.value!)
        .pipe(map((data: any) => data))
        .subscribe((data) => {

          if (data.data !== '00000000-0000-0000-0000-000000000000') {

              this.idUserByEmployeCode = data.data;
              
          } else {
            this.resetStructures();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El usuario no existe.',
              confirmButtonColor: '#0A6EBD',
            });
          }
        });
    }

    //Al seleccionar fecha fiil the workingWeek array up
    onDateChange(event: any) {

     // this.workingWeek = [];
      //Based on selected date
      let date = new Date(this.fechaSeleccionada.value as unknown as Date);
      let year = date.getFullYear().toString();
      let week = this.getWeek(date);
      this.semanaAno = week.toString();//
      this.fechaSemanaAno = year;//
      console.log(this.fechaSemanaAno,' ano ', this.semanaAno, ' semana');
  
      var current = new Date(date);
      if(current.getDay() != 0){
          current.setDate(((current.getDate() - current.getDay())));
      }
   
        this.consultarHorarioEmpleado();
    }

    //Get shcedule's employee based on selected date and update/fill arrHorarioEmpleado up
    consultarHorarioEmpleado(){//clonado

      this.arrHorarioEmpleado=[];
      let dateSelected = new Date(this.fechaSeleccionada.value as unknown as Date);

        this.serviceList.loadHorarios(this.idUserByEmployeCode, dateSelected).subscribe(horario => {
          
          if(horario!=null){
              this.hayHorario=true;

               //new--------------------------------------------------
                dateSelected.setDate(dateSelected.getDate() - dateSelected.getDay());

                //complete empty days of arrHorarioEmpleado with default values
                this.completeSchedule(horario);
        }
        else{
          this.hayHorario=false;
         
          dateSelected.setDate(dateSelected.getDate() - dateSelected.getDay());

            for (let filaTemplate of this.WeekTemplate) {
              filaTemplate.date = new Date(dateSelected);
              dateSelected.setDate(dateSelected.getDate()+1);
              
            }
            //complete arrHorarioEmpleado with default values
            this.completeScheduleEmpty(this.WeekTemplate[0].date);
        }

        });

    }


    completeSchedule(horarios: MCreateHorarioEditable[]) {

      let diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      let date = new Date(horarios[0].fechaWorking);
      let dia = date.getUTCDate();
      let diaSemana = date.getUTCDay();
      date.setUTCDate(dia - diaSemana);
  
      // si no existe un dia en el horario guardado, lo añade e inicializa las horas vacias
      diasSemana.forEach(dia => {

            let diaEncontrado = horarios.find(horario => horario.day === dia);
            let fechaWorking = date.toISOString();
            
            if (!diaEncontrado) {
              horarios.push({
                userEntityId: horarios[0].userEntityId,
                week: horarios[0].week,
                horaInicio: '',
                horaFin: '',
                day: dia,
                ano: horarios[0].ano,
                fechaWorking:fechaWorking,
                editable:true
              });
            }
      
            date.setUTCDate(date.getUTCDate() + 1);

      });

      horarios = horarios.map(horario => {
        return { ...horario, editable:true };
      });
  
      horarios.sort((a: any, b: any) => diasSemana.indexOf(a.day) - diasSemana.indexOf(b.day));
  
      console.log(horarios, 'antes de arrHorarioEmpleado')
      for (let element of horarios) {
        this.arrHorarioEmpleado.push(element)
  
        console.log(this.arrHorarioEmpleado, 'arrHorarioEmpleado')
      }
  
      this.mHorarioVista = this.arrHorarioEmpleado.map(horario => {
        return { ...horario, editable: true };
      });
  
    }

    completeScheduleEmpty(fechaIni: Date) {

      let horarios: MCreateHorarioEditable[] = [];
     

      let diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      let date = fechaIni ;//new Date(horarios[0].fechaWorking);
      let dia = date.getUTCDate();
      let diaSemana = date.getUTCDay();
      date.setUTCDate(dia - diaSemana);
  
      // si no existe un dia en el horario guardado, lo añade e inicializa las horas vacias
      diasSemana.forEach(dia => {
        let fechaWorking = date.toISOString();
          horarios.push({
            userEntityId: this.idUserByEmployeCode,
            week: this.semanaAno,
            horaInicio: '',
            horaFin: '',
            day: dia,
            ano: this.fechaSemanaAno,
            fechaWorking:fechaWorking,
            editable:true
          });
  
        date.setUTCDate(date.getUTCDate() + 1);
      });
  
      horarios.sort((a: any, b: any) => diasSemana.indexOf(a.day) - diasSemana.indexOf(b.day));
  
      console.log(horarios, 'antes de arrHorarioEmpleado')
      for (let element of horarios) {
        this.arrHorarioEmpleado.push(element)
  
        console.log(this.arrHorarioEmpleado, 'arrHorarioEmpleado')
      }
  
     
      this.mHorarioVista = this.arrHorarioEmpleado.map(horario => {
        return { ...horario, editable: true };
      });
  
    }
    

    validateHorarios () {
      for (let horario of this.arrHorarioEmpleado) {
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

    //==========================================================================================================
    
   

    //add or update ini/end hours
    onHoraInichanged(event: any, day: string) {

      let diaHoraInicio = { horaInicio: event.value, dia: day };
      console.log(diaHoraInicio)
  
      let index = this.arrHoraInicio.findIndex(
        (elemento) => elemento.dia === diaHoraInicio.dia
      );
  
      if (index !== -1) {
        console.log('reemplazo')
        this.arrHoraInicio[index] = diaHoraInicio;
      } else {
        console.log('nuevo')
        this.arrHoraInicio.push(diaHoraInicio)
      }
      console.log(this.arrHoraInicio, 'evento');
    }

    onHoraFinchanged(event: any, day: string) {
      let diaHoraFin = { horaFin: event.value, dia: day };
      console.log(diaHoraFin)
  
      let index = this.arrHoraFin.findIndex(
        (elemento) => elemento.dia === diaHoraFin.dia
      );
  
      if (index !== -1) {
        console.log('reemplazo')
        this.arrHoraFin[index] = diaHoraFin;
      } else {
        console.log('nuevo')
        this.arrHoraFin.push(diaHoraFin)
      }
      console.log(this.arrHoraFin, 'evento');
    }

    onTabSelected(tabChangeEvent: MatTabChangeEvent){

      console.log('tabChangeEvent => ', tabChangeEvent); 
      console.log('index => ', tabChangeEvent.index); 
      //0,1 and 2
      this.tabSelected=tabChangeEvent.index.toString();
      console.log("usuario del horario:",this.idUserByEmployeCode);
    }

    guardaHorarios(){

      if( this.hayHorario==true){

        //Actualizar horario
        this.afectaHorario();

      }else{

        //Crear horario
        this.creaHorario1();
      }
}

    afectaHorario() {

      console.log("Actualizando horario")
      console.log(this.arrHoraInicio);//arr with all new changes
      console.log(this.arrHoraFin);//arr with all new changes
      //------------------------------------------------------------------------------------------
      console.log("Original...");
      console.log(this.arrHorarioEmpleado);//arr with employee schedule
      //------------------------------------------------------------------------------------------
  
     
   
      
      //Updatting arrHoraInicio with new changes
      if (this.arrHoraInicio.length) {
        for (let element of this.arrHoraInicio) {
          let index = this.arrHorarioEmpleado.findIndex((mHorario) => mHorario.day === element.dia );
          this.arrHorarioEmpleado[index].horaInicio = element.horaInicio;
        }
      }

      if (this.arrHoraFin.length) {
        for (let elementFin of this.arrHoraFin) {
          let index = this.arrHorarioEmpleado.findIndex( (mHorario) => mHorario.day === elementFin.dia );
          this.arrHorarioEmpleado[index].horaFin = elementFin.horaFin;
        }
      }

      //------------------------------------------------------------------------------------------
      console.log("Actualizado...");
      console.log(this.arrHorarioEmpleado);//arr with employee schedule
      //------------------------------------------------------------------------------------------
      
      console.log(this.mHorarioVista);
      this.mHorarioVista.forEach((item,index)=>{
        if(!item.editable){
          try{
            this.arrHorarioEmpleado[index].horaFin="";
            this.arrHorarioEmpleado[index].horaInicio="";
          }catch(errx){
            console.log("No indice")
          }
         
        }
      })


     
      //cleaning empty values
      this.arrHorarioEmpleado = this.arrHorarioEmpleado.filter((horario: any) => horario.horaInicio != '' && horario.horaFin != '' ) ; 
  

      if(this.arrHorarioEmpleado.length==0 ){
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Verifique los horarios . No hay datos validos.',
          confirmButtonColor: '#0A6EBD',
        });

        this.resetSimple();
        this.consultarHorarioEmpleado();
        return;
      }


      console.log('Esto es lo que se envia en la actualizacion. ')
  
      console.log(this.arrHorarioEmpleado)
  
      if (this.arrHorarioEmpleado.length) {

        //to Validate, if all schedules are OK!
        let valid = this.validateHorarios();
        if (!valid) {

          this.resetSimple();
          this.consultarHorarioEmpleado();
          return;
        }
        
        this.horarioCreate.PostCreateHorario(this.arrHorarioEmpleado)  
          .subscribe((data) => {
            if (data.data) {
              Swal.fire({
                icon: 'success',
                title: 'Actualizacion completada correctamente.',
                confirmButtonColor: '#0A6EBD',
              });
              
              this.resetSimple();
              this.consultarHorarioEmpleado();
              
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error, los datos no se pudieron cargar',
                confirmButtonColor: '#0A6EBD',
              });
            }
          });
      } else {
        //Eliminando horario

        this.mHorario = {
          horaInicio: "delete",
          horaFin: "",
          week:this.semanaAno,
          userEntityId: this.idUserByEmployeCode,
          day: "",
          ano: this.fechaSemanaAno,
          fechaWorking:"2024-04-28T00:00:00-06:00",
          editable:true
        };
        

        this.arrHorarioEmpleado=[];
        this.arrHorarioEmpleado.push(this.mHorario);
    
        
        this.horarioCreate.PostCreateHorario(this.arrHorarioEmpleado)  
          .subscribe((data) => {
            if (data.data) {
              Swal.fire({
                icon: 'success',
                title: 'Horario eliminado correctamente.',
                confirmButtonColor: '#0A6EBD',
              });
              this.resetSimple();
              this.consultarHorarioEmpleado();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error, no sepudo aplicar el borrado de horario',
                confirmButtonColor: '#0A6EBD',
              });
            }
          });


      
      }
  
    }

    creaHorario1() {
      console.log("Actualizando horario 1")
      console.log(this.arrHoraInicio);
      console.log(this.arrHoraFin);
    
      
      if (this.arrHoraInicio.length) {
        for (let element of this.arrHoraInicio) {
          let index = this.arrHorarioEmpleado.findIndex( (mHorario) => mHorario.day === element.dia );
          try{
            this.arrHorarioEmpleado[index].horaInicio = element.horaInicio;
          }catch(errx){
            console.log("No indice")
          }
         
        }
      }


      if (this.arrHoraFin.length) {
        for (let elementFin of this.arrHoraFin) {
          let index = this.arrHorarioEmpleado.findIndex( (mHorario) => mHorario.day === elementFin.dia );
          
          try{
            this.arrHorarioEmpleado[index].horaFin = elementFin.horaFin;
          }catch(errx){
            console.log("No indice")
          }
        }
      }
      
      //cleaning empty values
      this.arrHorarioEmpleado = this.arrHorarioEmpleado.filter((horario: any) => horario.horaInicio != '' && horario.horaFin != '' ) ; 

      if (this.arrHorarioEmpleado.length) {
        let valid = this.validateHorarios();
        if (!valid) return;
        
        this.horarioCreate.PostCreateHorario(this.arrHorarioEmpleado)
  
          .subscribe((data) => {
            if (data.data) {
              Swal.fire({
                icon: 'success',
                title: 'Horario creado correctamente.',
                confirmButtonColor: '#0A6EBD',
              });
              //this.dialogRef.close();
              //this.arrHorarioEmpleado = [];
              //this.listHoraInicio=[];
              //this.listHoraFin=[];
              

              this.consultarHorarioEmpleado();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error, los datos no se pudieron cargar',
                confirmButtonColor: '#0A6EBD',
              });
            }
          });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, esta intentando cargar un horario vacio.',
          confirmButtonColor: '#0A6EBD',
        });
      }
  
    }

   

   

    //=================================================================================================================
    

    cargarArchivoHorario() {
      let elemento = document.getElementById('fileInputHorario');
      if(elemento) {
        elemento.click();
      } else {
        console.log("No se encontró el elemento con id 'fileInputHorario'");
      }
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
                 // debugger;
                  console.log(data);
                  if(data.data){
                    Swal.fire({
                      icon: 'success',
                      title: 'Carga de archivo completada.',
                      confirmButtonColor: '#0A6EBD',
                    });
                    this.fileInputHorario.nativeElement.value = null;
                    //reload
                    // this.activarBarra = false;
                    this.consultarHorarioEmpleado();
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

    resetEditable() {
      this.WeekTemplate.forEach(dato => {
        dato.editable = false;
      });
    }

    downloadTemplate() {
      this.horarioService.getTemplate().subscribe(resp => {
        let m: any = (resp.headers.get('content-disposition') as string).match(/filename=\"?([^;\"]+)\"?;?/);
        const fileName = m? m[1] : '';
        const blob = new Blob([resp.body]);
        const url= window.URL.createObjectURL(blob);
        this.downloadTemplateEl.nativeElement.href = url;
        this.downloadTemplateEl.nativeElement.download = fileName;
        this.downloadTemplateEl.nativeElement.click();
 
      });
    }

    checkChanged1(event: any, editable: boolean){

    }

//-----------------Horario2---------------------------------------------------------------------------------------------------------------
/*
verificacionDias2(horarios2: MCreateHorario[]) {}

consultarHorarioEmpleado2(){}

completaHorario2(fechaIni: Date) {}

miFuncion2(event: any, day: string) {}

creaHorario2() {}

actualizarHorario2() {}

validateHorarios2 () {}

validateHorario2(day: string, horaInicio: string, horaFin: string) {}
*/

//-----------------------------------------------------------------------------------------------------------------------------------------




}
