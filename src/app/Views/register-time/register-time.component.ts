import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { MCreateHorusReport, MCreatePortalDB, MPortalDBResponse } from 'src/app/Models/MHorusReport';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { ClientService } from 'src/app/AdminViews/AdminClients/services/client/client.service';
import { EMPTY, map } from 'rxjs';
import { MClientEntity } from 'src/app/Models/MClienteEntity';
import { RegisterTimeService } from 'src/app/Views/register-time/services/register-time/register-time.service';
import { ApiUser } from 'src/app/Views/user/services/user/api.user';
import { MAprobadorUsuario } from 'src/app/Models/MAprobadorUsuario';
import { guid } from '@fullcalendar/core/internal';
import Swal from 'sweetalert2';
import { formatRange } from '@fullcalendar/core';
import { DatePipe } from '@angular/common';
import { MHorarioRegistrado } from 'src/app/Models/MHorarioRegistrado';

interface MiObjeto {
  [key: string]: any;
}

interface MiObjetoApp {
  [key: string]: any;
}

interface SideNavTogg1e {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-register-time',
  templateUrl: './register-time.component.html',
  styleUrls: ['./register-time.component.css'],
})
export class RegisterTimeComponent {
  MUser: MUserEntity;
  MHours: MCreateHorusReport;
  MHoursResponse: MPortalDBResponse;
  MHorarioR: MHorarioRegistrado;
  MClient: MClientEntity[];
  MAprobadorUser: MAprobadorUsuario[];
  clientes: [] = [];
  aprobadores: [] = [];
  aprobador = new FormControl('');
  descripcion = new FormControl('');
  fecha = new FormControl(null);
  actividad = new FormControl('');
  horaInicio = new FormControl('');
  horaFin = new FormControl('');
  reporte: string = '';
  cliente = new FormControl('');
  idcliente = new FormControl('');
  cantidadHoras: number = 0;
  f!: Date;
  inicio: string | null;
  fin: string | null;
  pipe = new DatePipe('en-US');
  activarBarra = false;
  todayDate!: Date;
  selectedByDefault:string;

  constructor(
    private storageService: StorageService,
    private apiClient: ClientService,
    private apiReportHours: RegisterTimeService,
    private apiUser: ApiUser
  ) {
    this.MUser = {} as MUserEntity;
    this.MHours = {} as MCreatePortalDB;
    this.MHorarioR = {} as MHorarioRegistrado;
    this.horaInicio.valueChanges.subscribe(() => {
      this.calcularHoras();
    });
    this.horaFin.valueChanges.subscribe(() => {
      this.calcularHoras();
    });

    /* this.horaFin.valueChanges.subscribe(() => {
      this.generarCodigo();
    }); */
    this.MUser = this.storageService.obtenerDatosMapeados();
    this.Aproved();

    this.MClient = [];
    this.MAprobadorUser = [];

    this.inicio = this.horaInicio.value;
    this.fin = this.horaInicio.value;
    this.MHoursResponse = {} as MPortalDBResponse;
    this.selectedByDefault="Standby";
    
  }

  getWeek(date: Date): number {
    let onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(
      ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) /7);
  }

  generarCodigo(): void {
    // Genera una cadena basada en la fecha y hora actual hasta los milisegundos
    let parteFecha = new Date().toISOString();

    // Genera una cadena aleatoria de 8 caracteres alfanuméricos
    let parteAleatoria = Math.random().toString(36).substr(2, 8);

    this.reporte = parteFecha + parteAleatoria;
  }

  calcularHoras(): void {
    if (
      this.horaInicio.value &&
      this.horaFin.value !== null &&
      this.horaFin.value != ''
    ) {
      const horaInicioParts = this.horaInicio.value.split(':');
      const horaFinParts = this.horaFin.value.split(':');

      const horaInicioDate = new Date();
      horaInicioDate.setHours(+horaInicioParts[0], +horaInicioParts[1], 0, 0);

      const horaFinDate = new Date();
      if (
        +horaFinParts[0] < +horaInicioParts[0] ||
        (+horaFinParts[0] == +horaInicioParts[0] &&
          +horaFinParts[1] < +horaInicioParts[1])
      ) {
        // Si la hora de fin es menor que la hora de inicio, asumimos que es del día siguiente
        horaFinDate.setDate(horaFinDate.getDate() + 1);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El rango de horas ingresado no es correcto.',
          confirmButtonColor: '#0A6EBD',
        });
        this.horaFin.reset();
        this.cantidadHoras = 0;
        return
      }
      horaFinDate.setHours(+horaFinParts[0], +horaFinParts[1], 0, 0);

      const diferencia = horaFinDate.getTime() - horaInicioDate.getTime();

      this.cantidadHoras = diferencia / (1000 * 60 * 60);

      if (this.cantidadHoras == 0 || this.cantidadHoras > 23.983333333333334) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El rango de horas ingresado no es correcto.',
          confirmButtonColor: '#0A6EBD',
        });
        this.horaFin.reset();
      }
    } else {
    }
  }

  async enviar() {
    let dateValue = this.fecha.value;
    if (!dateValue) return;
    let selectedDate = dateValue as Date;

    this.activarBarra = true;
    //let todayWithPipe = null;
    let todayWithPipeUS=null;
    //2023-12-14T00:00:00.0000000
    todayWithPipeUS = this.pipe.transform(selectedDate, 'dd/MM/yyyy');
    //todayWithPipe = this.pipe.transform(this.fecha.value?.toString() as unknown as string,'yyyy-MM-dd');

    //let fechaSeleccionada = new Date(todayWithPipe?.toString() as unknown as string);
    //------------validacion horario definido----------------------------------------------------------
    this.MHorarioR.ano=selectedDate.getFullYear().toString();
    this.MHorarioR.userEntityId= this.MUser.idUser as Guid;
    this.MHorarioR.week=this.getWeek(selectedDate).toString();
    console.log("Consulta horario::::::::");
    console.log(this.MHorarioR);
    (await this.apiReportHours.GetConsultHorarioByWeek(this.MHorarioR)).subscribe(
      async (data) => {
        
        console.log(data);


        if (data.data == null) {
          this.activarBarra = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Su reporte no puede ser enviado ya que no tiene un horario asignado, por favor comuníquese con su coordinador para que se ejecute ese proceso.',
            confirmButtonColor: '#0A6EBD',
          });
        } else {
            //continua con el proceso
            let todayWithPipe = null;
            todayWithPipe = this.pipe.transform(selectedDate,'yyyy-MM-dd');
            
            this.MHours.userEntityId = this.MUser.idUser as Guid;
            this.MHours.startDate = ((todayWithPipe?.toString() as unknown as string) + ' ' + this.horaInicio.value) as string;
            this.MHours.startTime = this.horaInicio.value as string;
            this.MHours.endTime = this.horaFin.value as string;
            this.MHours.clientEntityId = null as unknown as Guid;
            this.MHours.description = this.descripcion.value as string;
            this.MHours.tipoReporte = 1;
            this.MHours.acitivity = 0;//this.actividad.value as unknown as number;
            this.MHours.countHours = this.cantidadHoras.toString() as unknown as string;
            this.MHours.approverId = this.aprobador.value?.toString() as unknown as string;
            this.MHours.numberReport = 0;

            console.log(this.MHours);

            (await this.apiReportHours.PostCreatePortalDbReport(this.MHours)).subscribe(
              (data) => {
                this.activarBarra = false;
                this.MHoursResponse = data;

                if (this.MHoursResponse.data.state==99) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en el registro de horas, no existe horario asignado.',
                    confirmButtonColor: '#0A6EBD',
                  });
                } else if (this.MHoursResponse.data.state==100) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en el registro de horas, por tratar de asignar un horario standby durante horario laboral.',
                    confirmButtonColor: '#0A6EBD',
                  });
                }else if (this.MHoursResponse.data.state==101) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en el registro de horas, el registro supera el límite de horas para StandBy.',
                    confirmButtonColor: '#0A6EBD',
                  });
                }else if (this.MHoursResponse.data.state==102) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en el registro de horas, existe Overlaping.',
                    confirmButtonColor: '#0A6EBD',
                  });
                }else {
                       this.fecha.reset();
                     this.fecha.reset();
                     this.horaInicio.reset();
                     this.horaFin.reset();
                     this.descripcion.reset();
                     this.actividad.reset();
                     this.aprobador.reset();
                     this.cantidadHoras=0;
                     this.reporte='';
                  Swal.fire({
                    icon: 'success',
                    title: 'Registro de horas se genero correctamente',
                    confirmButtonColor: '#0A6EBD',
                  });
                }


              }
            );

         //------------------------
        }//end else

        //this.activarBarra = false;
      }
    );


    //------------validacion horario definido----------------------------------------------------------

    
    
  }

  ngOnInit(): void {
    this.MUser = this.storageService.obtenerDatosMapeados();

    this.apiClient
      .GetClient()
      .pipe(map((data: MiObjeto) => data))
      .subscribe((data) => {
        let lista = data['data'];

        this.MClient = lista;
      });


      this.todayDate = new Date();
      
  }

  changeHandler() {
    this.calcularHoras();
    // this.enviar();

    if (this.cantidadHoras > 23.983333333333334) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Horas mayores a 23.',
        confirmButtonColor: '#0A6EBD',
      });
      this.horaFin = new FormControl();
    }
  }

  Aproved() {
    this.MUser = this.storageService.obtenerDatosMapeados();

    /*if(this.MUser.rolEntity.nameRole == 'Usuario Aprobador N2' || 
       this.MUser.rolEntity.nameRole == 'Administrador'||
       this.MUser.rolEntity.nameRole =='Super Administrador'){
        
        this.apiUser
          .GetAprovved(3)
          .pipe(map((data: MiObjetoApp) => data))
          .subscribe((data) => {
            let listap = data['data'];
            console.log(listap, listap.result)
            this.MAprobadorUser = listap.result;
            this.MAprobadorUser = this.MAprobadorUser.filter(x => x.userEntity.countryEntityId == this.MUser.countryEntityId)
          console.log("roles disponibles:::");
            console.log(JSON.stringify(this.MAprobadorUser[0]));
          });

    }else{*/

      
    this.apiUser
    .GetAprovved(1)
    .pipe(map((data: MiObjetoApp) => data))
    .subscribe((data) => {
      let listap = data['data'];
      console.log(listap, listap.result)
      this.MAprobadorUser = listap.result;
      this.MAprobadorUser = this.MAprobadorUser.filter(x => x.userEntity.countryEntityId == this.MUser.countryEntityId)
    console.log("roles disponibles:::");
      console.log(JSON.stringify(this.MAprobadorUser[0]));
    });


   // }

    
  }

  
  select(plan: any) {
    this.idcliente.setValue(plan.value);
  }
}
