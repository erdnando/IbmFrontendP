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
  
  WeekTemplate1 = [
    { day: 'Domingo', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Lunes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Martes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Miércoles', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Jueves', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Viernes', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Sábado', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
  ];

  WeekTemplate2 = [
    { day: 'Domingo', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Lunes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Martes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Miércoles', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Jueves', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Viernes', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Sábado', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
  ];

  WeekTemplate3 = [
    { day: 'Domingo', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Lunes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Martes',  date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Miércoles', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Jueves', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Viernes', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
    { day: 'Sábado', date: new Date(), horaInicio: '08:00 a.m', horaFin: '05:00 p.m', editable: true },
  ];
  
  columnasAMostrar = ['dias', 'inicio','a', 'fin'];


  MUser: any;
  columnasexcel:string[]=["#", "NOMBRE DIA", "HORA INICIO", "HORA FIN", "FECHA", "CODIGO EMP", "PAIS"];
  MListCountry: MCountryEntity[];
  ExcelData: any;
  processing:boolean=false;
  codeEmployed = new FormControl("");
  fechaSeleccionada = new FormControl(null);
  confirmedControl = new FormControl(false);
  pais = new FormControl('');//OK
  semanaAno: string = '';
  idUserByEmployeCode: string = '';
  fechaSemanaAno: string = "";
  tabSelected: string = "0";
  mHorario: MCreateHorarioEditable;//estructura reutilizable

//------------------H1--------------------------
  arrHorarioEmpleado1: MCreateHorarioEditable[] = [];//OK
  mHorarioVista1: any[] = [];
  hayHorario1: boolean = false;//OK
  arrHoraInicio1: any[] = [];
  arrHoraFin1: any[] = [];
  //--------------------------------------------
  arrHorarioEmpleado2: MCreateHorarioEditable[] = [];//OK
  mHorarioVista2: any[] = [];
  hayHorario2: boolean = false;//OK
  arrHoraInicio2: any[] = [];
  arrHoraFin2: any[] = [];

  //--------------------------------------------
  arrHorarioEmpleado3: MCreateHorarioEditable[] = [];//OK
  mHorarioVista3: any[] = [];
  hayHorario3: boolean = false;//OK
  arrHoraInicio3: any[] = [];
  arrHoraFin3: any[] = [];


  //--------------------------------------------

  
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
    this.mHorario = {} as MCreateHorarioEditable;//estructura reutilizable
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
       this.resetStructures1();
       this.resetStructures2();
       //this.resetStructures3();
    }

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
   
        this.consultarHorarioEmpleado1();
        this.consultarHorarioEmpleado2();
        this.consultarHorarioEmpleado3();
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

    onTabSelected(tabChangeEvent: MatTabChangeEvent){

      console.log('tabChangeEvent => ', tabChangeEvent); 
      console.log('index => ', tabChangeEvent.index); 
      //0,1 and 2
      this.tabSelected=tabChangeEvent.index.toString();
      console.log("usuario del horario:",this.idUserByEmployeCode);
    }

    guardaHorarios(){

      if( this.tabSelected=="0") this.afectaHorario1();
      if( this.tabSelected=="1") this.afectaHorario2();
      if( this.tabSelected=="2") this.afectaHorario3();
    }

    

//----------------------------Horario 1------------------------------------------------------------------------------
    resetStructures1(){
      this.codeEmployed.reset();
      this.fechaSeleccionada.reset();
      this.semanaAno='';

      this.arrHorarioEmpleado1 = [];
      this.mHorarioVista1=[];
      this.arrHoraInicio1=[];
      this.arrHoraFin1=[];
    }

    resetSimple1(){
      
      this.arrHorarioEmpleado1 = [];
      this.mHorarioVista1=[];
      
      this.arrHoraInicio1=[];
      this.arrHoraFin1=[];
      this.confirmedControl.setValue(false);
    }

     //Get shcedule's employee based on selected date and update/fill arrHorarioEmpleado up
     consultarHorarioEmpleado1(){//clonado

      this.arrHorarioEmpleado1=[];
      let dateSelected = new Date(this.fechaSeleccionada.value as unknown as Date);

        this.serviceList.loadHorariosNuevo(this.idUserByEmployeCode, dateSelected,"1").subscribe(horario => {
          
          if(horario!=null){
              this.hayHorario1=true;

               //new--------------------------------------------------
                dateSelected.setDate(dateSelected.getDate() - dateSelected.getDay());

                //complete empty days of arrHorarioEmpleado with default values
                this.completeSchedule1(horario);
        }
        else{
          this.hayHorario1=false;
         
          dateSelected.setDate(dateSelected.getDate() - dateSelected.getDay());

            for (let filaTemplate of this.WeekTemplate1) {
              filaTemplate.date = new Date(dateSelected);
              dateSelected.setDate(dateSelected.getDate()+1);
              
            }
            //complete arrHorarioEmpleado with default values
            this.completeScheduleEmpty1(this.WeekTemplate1[0].date);
        }

        });

    }

    completeSchedule1(horarios: MCreateHorarioEditable[]) {

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
        this.arrHorarioEmpleado1.push(element)
  
        console.log(this.arrHorarioEmpleado1, 'arrHorarioEmpleado')
      }
  
      this.mHorarioVista1 = this.arrHorarioEmpleado1.map(horario => {
        return { ...horario, editable: true };
      });
  
    }

    completeScheduleEmpty1(fechaIni: Date) {

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
        this.arrHorarioEmpleado1.push(element)
  
        console.log(this.arrHorarioEmpleado1, 'arrHorarioEmpleado')
      }
  
     
      this.mHorarioVista1 = this.arrHorarioEmpleado1.map(horario => {
        return { ...horario, editable: true };
      });
  
    }


    afectaHorario1() {
      let datosDesmarcados=false;
      console.log("Actualizando horario")
      console.log(this.arrHoraInicio1);//arr with all new changes
      console.log(this.arrHoraFin1);//arr with all new changes
      //------------------------------------------------------------------------------------------
      console.log("Original...");
      console.log(this.arrHorarioEmpleado1);//arr with employee schedule
      //------------------------------------------------------------------------------------------
  
     
   
      
      //Updatting arrHoraInicio with new changes
      if (this.arrHoraInicio1.length) {
        for (let element of this.arrHoraInicio1) {
          let index = this.arrHorarioEmpleado1.findIndex((mHorario) => mHorario.day === element.dia );
          this.arrHorarioEmpleado1[index].horaInicio = element.horaInicio;
        }
      }

      if (this.arrHoraFin1.length) {
        for (let elementFin of this.arrHoraFin1) {
          let index = this.arrHorarioEmpleado1.findIndex( (mHorario) => mHorario.day === elementFin.dia );
          this.arrHorarioEmpleado1[index].horaFin = elementFin.horaFin;
        }
      }

      //------------------------------------------------------------------------------------------
      console.log("Actualizado...");
      console.log(this.arrHorarioEmpleado1);//arr with employee schedule
      //------------------------------------------------------------------------------------------
      
      console.log(this.mHorarioVista1);
      this.mHorarioVista1.forEach((item,index)=>{
        if(!item.editable){
          datosDesmarcados=true;
          try{
            this.arrHorarioEmpleado1[index].horaFin="";
            this.arrHorarioEmpleado1[index].horaInicio="";
          }catch(errx){
            console.log("No indice")
          }
         
        }
      })


     
      //cleaning empty values
      this.arrHorarioEmpleado1 = this.arrHorarioEmpleado1.filter((horario: any) => horario.horaInicio != '' && horario.horaFin != '' ) ; 
  

      if(this.arrHorarioEmpleado1.length==0 && datosDesmarcados==false ){
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Verifique los horarios . No hay datos validos.',
          confirmButtonColor: '#0A6EBD',
        });

        this.resetSimple1();
        this.consultarHorarioEmpleado1();
        return;
      }


      console.log('Esto es lo que se envia en la actualizacion. ')
  
      console.log(this.arrHorarioEmpleado1)
  
      if (this.arrHorarioEmpleado1.length) {

        //to Validate, if all schedules are OK!
        let valid = this.validateHorarios1();
        if (!valid) {

          this.resetSimple1();
          this.consultarHorarioEmpleado1();
          return;
        }
        
        this.horarioCreate.PostCreateHorario1(this.arrHorarioEmpleado1)  
          .subscribe((data) => {
            if (data.data) {
              Swal.fire({
                icon: 'success',
                title: 'Actualizacion completada correctamente.',
                confirmButtonColor: '#0A6EBD',
              });
              
              this.resetSimple1();
              this.consultarHorarioEmpleado1();
              
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
        

        this.arrHorarioEmpleado1=[];
        this.arrHorarioEmpleado1.push(this.mHorario);
    
        
        this.horarioCreate.PostCreateHorario1(this.arrHorarioEmpleado1)  
          .subscribe((data) => {
            if (data.data) {
              Swal.fire({
                icon: 'success',
                title: 'Horario eliminado correctamente.',
                confirmButtonColor: '#0A6EBD',
              });
              this.resetSimple1();
              this.consultarHorarioEmpleado1();
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

    validateHorarios1 () {
      for (let horario of this.arrHorarioEmpleado1) {
        if (!this.validateHorario(horario.day, horario.horaInicio, horario.horaFin)) return false;
      }
      return true;
    }

    //add or update ini/end hours
    onHoraInichanged1(event: any, day: string) {

      let diaHoraInicio = { horaInicio: event.value, dia: day };
      console.log(diaHoraInicio)
  
      let index = this.arrHoraInicio1.findIndex(
        (elemento) => elemento.dia === diaHoraInicio.dia
      );
  
      if (index !== -1) {
        console.log('reemplazo')
        this.arrHoraInicio1[index] = diaHoraInicio;
      } else {
        console.log('nuevo')
        this.arrHoraInicio1.push(diaHoraInicio)
      }
      console.log(this.arrHoraInicio1, 'evento');
    }

    onHoraFinchanged1(event: any, day: string) {
      let diaHoraFin = { horaFin: event.value, dia: day };
      console.log(diaHoraFin)
  
      let index = this.arrHoraFin1.findIndex(
        (elemento) => elemento.dia === diaHoraFin.dia
      );
  
      if (index !== -1) {
        console.log('reemplazo')
        this.arrHoraFin1[index] = diaHoraFin;
      } else {
        console.log('nuevo')
        this.arrHoraFin1.push(diaHoraFin)
      }
      console.log(this.arrHoraFin1, 'evento');
    }

   

    //=================================================================================================================
    

   
   

//-----------------Horario2---------------------------------------------------------------------------------------------------------------

resetStructures2(){
  this.codeEmployed.reset();
  this.fechaSeleccionada.reset();
  this.semanaAno='';
  this.arrHorarioEmpleado2 = [];
  this.mHorarioVista2=[];
  this.arrHoraInicio2=[];
  this.arrHoraFin2=[];
}

resetSimple2(){
      
  this.arrHorarioEmpleado2 = [];
  this.mHorarioVista2=[];
  
  this.arrHoraInicio2=[];
  this.arrHoraFin2=[];
  this.confirmedControl.setValue(false);
}
//Get shcedule's employee based on selected date and update/fill arrHorarioEmpleado up
consultarHorarioEmpleado2(){//clonado

  this.arrHorarioEmpleado2=[];
  let dateSelected = new Date(this.fechaSeleccionada.value as unknown as Date);

    this.serviceList.loadHorariosNuevo(this.idUserByEmployeCode, dateSelected,"2").subscribe(horario => {
      
      if(horario!=null){
          this.hayHorario2=true;

           //new--------------------------------------------------
            dateSelected.setDate(dateSelected.getDate() - dateSelected.getDay());

            //complete empty days of arrHorarioEmpleado with default values
            this.completeSchedule2(horario);
    }
    else{
      this.hayHorario2=false;
     
      dateSelected.setDate(dateSelected.getDate() - dateSelected.getDay());

        for (let filaTemplate of this.WeekTemplate2) {
          filaTemplate.date = new Date(dateSelected);
          dateSelected.setDate(dateSelected.getDate()+1);
          
        }
        //complete arrHorarioEmpleado with default values
        this.completeScheduleEmpty2(this.WeekTemplate2[0].date);
    }

    });

}

completeSchedule2(horarios: MCreateHorarioEditable[]) {

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
    this.arrHorarioEmpleado2.push(element)

    console.log(this.arrHorarioEmpleado2, 'arrHorarioEmpleado')
  }

  this.mHorarioVista2 = this.arrHorarioEmpleado2.map(horario => {
    return { ...horario, editable: true };
  });

}

completeScheduleEmpty2(fechaIni: Date) {

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
    this.arrHorarioEmpleado2.push(element)

    console.log(this.arrHorarioEmpleado2, 'arrHorarioEmpleado')
  }

 
  this.mHorarioVista2 = this.arrHorarioEmpleado2.map(horario => {
    return { ...horario, editable: true };
  });

}

afectaHorario2() {
let datosDesmarcados=false;
  console.log("Actualizando horario")
  console.log(this.arrHoraInicio2);//arr with all new changes
  console.log(this.arrHoraFin2);//arr with all new changes
  //------------------------------------------------------------------------------------------
  console.log("Original...");
  console.log(this.arrHorarioEmpleado2);//arr with employee schedule
  //------------------------------------------------------------------------------------------

 

  
  //Updatting arrHoraInicio with new changes
  if (this.arrHoraInicio2.length) {
    for (let element of this.arrHoraInicio2) {
      let index = this.arrHorarioEmpleado2.findIndex((mHorario) => mHorario.day === element.dia );
      this.arrHorarioEmpleado2[index].horaInicio = element.horaInicio;
    }
  }

  if (this.arrHoraFin2.length) {
    for (let elementFin of this.arrHoraFin2) {
      let index = this.arrHorarioEmpleado2.findIndex( (mHorario) => mHorario.day === elementFin.dia );
      this.arrHorarioEmpleado2[index].horaFin = elementFin.horaFin;
    }
  }

  //------------------------------------------------------------------------------------------
  console.log("Actualizado...");
  console.log(this.arrHorarioEmpleado2);//arr with employee schedule
  //------------------------------------------------------------------------------------------
  
  console.log(this.mHorarioVista2);
  this.mHorarioVista2.forEach((item,index)=>{
    if(!item.editable){
      datosDesmarcados=true;
      try{
        this.arrHorarioEmpleado2[index].horaFin="";
        this.arrHorarioEmpleado2[index].horaInicio="";
      }catch(errx){
        console.log("No indice")
      }
     
    }
  })


 
  //cleaning empty values
  this.arrHorarioEmpleado2 = this.arrHorarioEmpleado2.filter((horario: any) => horario.horaInicio != '' && horario.horaFin != '' ) ; 


  if(this.arrHorarioEmpleado2.length==0 && datosDesmarcados==false ){
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Verifique los horarios . No hay datos validos.',
      confirmButtonColor: '#0A6EBD',
    });

    this.resetSimple2();
    this.consultarHorarioEmpleado2();
    return;
  }


  console.log('Esto es lo que se envia en la actualizacion. ')

  console.log(this.arrHorarioEmpleado2)

  if (this.arrHorarioEmpleado2.length) {

    //to Validate, if all schedules are OK!
    let valid = this.validateHorarios2();
    if (!valid) {

      this.resetSimple2();
      this.consultarHorarioEmpleado2();
      return;
    }
    
    this.horarioCreate.PostCreateHorario2(this.arrHorarioEmpleado2)  
      .subscribe((data) => {
        if (data.data) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizacion completada correctamente.',
            confirmButtonColor: '#0A6EBD',
          });
          
          this.resetSimple2();
          this.consultarHorarioEmpleado2();
          
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
    

    this.arrHorarioEmpleado2=[];
    this.arrHorarioEmpleado2.push(this.mHorario);

    
    this.horarioCreate.PostCreateHorario2(this.arrHorarioEmpleado2)  
      .subscribe((data) => {
        if (data.data) {
          Swal.fire({
            icon: 'success',
            title: 'Horario eliminado correctamente.',
            confirmButtonColor: '#0A6EBD',
          });
          this.resetSimple2();
          this.consultarHorarioEmpleado2();
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

validateHorarios2 () {
  for (let horario of this.arrHorarioEmpleado2) {
    if (!this.validateHorario(horario.day, horario.horaInicio, horario.horaFin)) return false;
  }
  return true;
}

 //add or update ini/end hours
 onHoraInichanged2(event: any, day: string) {

  let diaHoraInicio = { horaInicio: event.value, dia: day };
  console.log(diaHoraInicio)

  let index = this.arrHoraInicio2.findIndex(
    (elemento) => elemento.dia === diaHoraInicio.dia
  );

  if (index !== -1) {
    console.log('reemplazo')
    this.arrHoraInicio2[index] = diaHoraInicio;
  } else {
    console.log('nuevo')
    this.arrHoraInicio2.push(diaHoraInicio)
  }
  console.log(this.arrHoraInicio2, 'evento');
}

onHoraFinchanged2(event: any, day: string) {
  let diaHoraFin = { horaFin: event.value, dia: day };
  console.log(diaHoraFin)

  let index = this.arrHoraFin2.findIndex(
    (elemento) => elemento.dia === diaHoraFin.dia
  );

  if (index !== -1) {
    console.log('reemplazo')
    this.arrHoraFin2[index] = diaHoraFin;
  } else {
    console.log('nuevo')
    this.arrHoraFin2.push(diaHoraFin)
  }
  console.log(this.arrHoraFin2, 'evento');
}


//-------------Horario 3----------------------------------------------------------------------------------------------------------------------------

resetStructures3(){
  this.codeEmployed.reset();
  this.fechaSeleccionada.reset();
  this.semanaAno='';
  this.arrHorarioEmpleado3 = [];
  this.mHorarioVista3=[];
  this.arrHoraInicio3=[];
  this.arrHoraFin3=[];
}

resetSimple3(){
      
  this.arrHorarioEmpleado3 = [];
  this.mHorarioVista3=[];
  
  this.arrHoraInicio3=[];
  this.arrHoraFin3=[];
  this.confirmedControl.setValue(false);
}
//Get shcedule's employee based on selected date and update/fill arrHorarioEmpleado up
consultarHorarioEmpleado3(){//clonado

  this.arrHorarioEmpleado3=[];
  let dateSelected = new Date(this.fechaSeleccionada.value as unknown as Date);

    this.serviceList.loadHorariosNuevo(this.idUserByEmployeCode, dateSelected,"3").subscribe(horario => {
      
      if(horario!=null){
          this.hayHorario3=true;

           //new--------------------------------------------------
            dateSelected.setDate(dateSelected.getDate() - dateSelected.getDay());

            //complete empty days of arrHorarioEmpleado with default values
            this.completeSchedule3(horario);
    }
    else{
      this.hayHorario3=false;
     
      dateSelected.setDate(dateSelected.getDate() - dateSelected.getDay());

        for (let filaTemplate of this.WeekTemplate3) {
          filaTemplate.date = new Date(dateSelected);
          dateSelected.setDate(dateSelected.getDate()+1);
          
        }
        //complete arrHorarioEmpleado with default values
        this.completeScheduleEmpty3(this.WeekTemplate3[0].date);
    }

    });

}

completeSchedule3(horarios: MCreateHorarioEditable[]) {

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
    this.arrHorarioEmpleado3.push(element)

    console.log(this.arrHorarioEmpleado3, 'arrHorarioEmpleado')
  }

  this.mHorarioVista3 = this.arrHorarioEmpleado3.map(horario => {
    return { ...horario, editable: true };
  });

}

completeScheduleEmpty3(fechaIni: Date) {

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
    this.arrHorarioEmpleado3.push(element)

    console.log(this.arrHorarioEmpleado3, 'arrHorarioEmpleado')
  }

 
  this.mHorarioVista3 = this.arrHorarioEmpleado3.map(horario => {
    return { ...horario, editable: true };
  });

}

afectaHorario3() {
  let datosDesmarcados=false;
  console.log("Actualizando horario")
  console.log(this.arrHoraInicio3);//arr with all new changes
  console.log(this.arrHoraFin3);//arr with all new changes
  //------------------------------------------------------------------------------------------
  console.log("Original...");
  console.log(this.arrHorarioEmpleado3);//arr with employee schedule
  //------------------------------------------------------------------------------------------

 

  
  //Updatting arrHoraInicio with new changes
  if (this.arrHoraInicio3.length) {
    for (let element of this.arrHoraInicio3) {
      let index = this.arrHorarioEmpleado3.findIndex((mHorario) => mHorario.day === element.dia );
      this.arrHorarioEmpleado3[index].horaInicio = element.horaInicio;
    }
  }

  if (this.arrHoraFin3.length) {
    for (let elementFin of this.arrHoraFin3) {
      let index = this.arrHorarioEmpleado3.findIndex( (mHorario) => mHorario.day === elementFin.dia );
      this.arrHorarioEmpleado3[index].horaFin = elementFin.horaFin;
    }
  }

  //------------------------------------------------------------------------------------------
  console.log("Actualizado...");
  console.log(this.arrHorarioEmpleado3);//arr with employee schedule
  //------------------------------------------------------------------------------------------
  
  console.log(this.mHorarioVista3);
  this.mHorarioVista3.forEach((item,index)=>{
    if(!item.editable){
      datosDesmarcados=true;
      try{
        this.arrHorarioEmpleado3[index].horaFin="";
        this.arrHorarioEmpleado3[index].horaInicio="";
      }catch(errx){
        console.log("No indice")
      }
     
    }
  })


 
  //cleaning empty values
  this.arrHorarioEmpleado3 = this.arrHorarioEmpleado3.filter((horario: any) => horario.horaInicio != '' && horario.horaFin != '' ) ; 


  if(this.arrHorarioEmpleado3.length==0 && datosDesmarcados==false ){
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Verifique los horarios . No hay datos validos.',
      confirmButtonColor: '#0A6EBD',
    });

    this.resetSimple3();
    this.consultarHorarioEmpleado3();
    return;
  }


  console.log('Esto es lo que se envia en la actualizacion. ')

  console.log(this.arrHorarioEmpleado3)

  if (this.arrHorarioEmpleado3.length) {

    //to Validate, if all schedules are OK!
    let valid = this.validateHorarios3();
    if (!valid) {

      this.resetSimple3();
      this.consultarHorarioEmpleado3();
      return;
    }
    
    this.horarioCreate.PostCreateHorario3(this.arrHorarioEmpleado3)  
      .subscribe((data) => {
        if (data.data) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizacion completada correctamente.',
            confirmButtonColor: '#0A6EBD',
          });
          
          this.resetSimple3();
          this.consultarHorarioEmpleado3();
          
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
    

    this.arrHorarioEmpleado3=[];
    this.arrHorarioEmpleado3.push(this.mHorario);

    
    this.horarioCreate.PostCreateHorario3(this.arrHorarioEmpleado3)  
      .subscribe((data) => {
        if (data.data) {
          Swal.fire({
            icon: 'success',
            title: 'Horario eliminado correctamente.',
            confirmButtonColor: '#0A6EBD',
          });
          this.resetSimple3();
          this.consultarHorarioEmpleado3();
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

validateHorarios3 () {
  for (let horario of this.arrHorarioEmpleado3) {
    if (!this.validateHorario(horario.day, horario.horaInicio, horario.horaFin)) return false;
  }
  return true;
}

 //add or update ini/end hours
 onHoraInichanged3(event: any, day: string) {

  let diaHoraInicio = { horaInicio: event.value, dia: day };
  console.log(diaHoraInicio)

  let index = this.arrHoraInicio3.findIndex(
    (elemento) => elemento.dia === diaHoraInicio.dia
  );

  if (index !== -1) {
    console.log('reemplazo')
    this.arrHoraInicio3[index] = diaHoraInicio;
  } else {
    console.log('nuevo')
    this.arrHoraInicio3.push(diaHoraInicio)
  }
  console.log(this.arrHoraInicio3, 'evento');
}

onHoraFinchanged3(event: any, day: string) {
  let diaHoraFin = { horaFin: event.value, dia: day };
  console.log(diaHoraFin)

  let index = this.arrHoraFin3.findIndex(
    (elemento) => elemento.dia === diaHoraFin.dia
  );

  if (index !== -1) {
    console.log('reemplazo')
    this.arrHoraFin3[index] = diaHoraFin;
  } else {
    console.log('nuevo')
    this.arrHoraFin3.push(diaHoraFin)
  }
  console.log(this.arrHoraFin3, 'evento');
}



//------------------------------------------------------------------------------------------------------------------------




//-------------------Excel------------------------------------------------------------------------------------------

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
  this.processing=true;
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
          this.processing=false;
        }else{
          let XL_row_object = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { raw: false });
          let json_object = JSON.stringify(XL_row_object);
          // aqui parseamos a json
          const datos = JSON.parse(json_object);
          console.log(this.ExcelData);
          if(this.ExcelData.length){

            console.log(this.ExcelData);
            try{
            this.loadArpExcelService.PostLoadHorarios(datos).subscribe((data: any) => {//datos --> this.ExcelData
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
                this.processing=false;
               // this.consultarHorarioEmpleado1();
                this.resetStructures();
           
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error: La carga no se realizo!. Revise los formatos de las fechas. El formato aceptado es dd/MM/yyyy. Y se han encontrado fechas como: (7/17/2024).',
                  confirmButtonColor: '#0A6EBD',
                });
                this.fileInputHorario.nativeElement.value = null;
                this.processing=false;
                this.resetStructures();
              }
            });
          }catch(ex){
            console.log(ex)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error:  No se pudo cargar el archivo, porfavor reviselo.',
              confirmButtonColor: '#0A6EBD',
            });
            this.fileInputHorario.nativeElement.value = null;
            this.resetStructures();
            this.processing=false;
          }
            
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
            this.resetStructures();
            this.processing=false;
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


}
