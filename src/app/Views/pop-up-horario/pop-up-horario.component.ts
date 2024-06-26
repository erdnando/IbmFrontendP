import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MCreateHorario } from 'src/app/Models/MHorario';
import Swal from 'sweetalert2';
import { HorarioCreateService } from '../parameters/services/horarioCreate/horario-create.service';

@Component({
  selector: 'app-pop-up-horario',
  templateUrl: './pop-up-horario.component.html',
  styleUrls: ['./pop-up-horario.component.css']
})
export class PopUpHorarioComponent {

  horario: MCreateHorario[] = [];
  mHorario: any = {};
  mHorarioList: any[] = [];
  horaInicio: string = "";
  horaFin: string = "";
  listHoraInicio: any[] = [];
  nuevoHorario: any[] = [[],[],[],[],[],[],[]];

  columnasAMostrar = ['dias', 'inicio', 'a', 'fin'];
  days: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopUpHorarioComponent>,
    private horarioCreate: HorarioCreateService
  ) { }

  validateHorarios () {
    for (let daySchedules of this.mHorarioList) {
      for (let schedule of daySchedules) {
        if (!this.validateHorario(schedule.day, schedule.horaInicio, schedule.horaFin)) return false;
      }
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

  addDaySchedule(dayIndex: number, currentSchedule: any) {
    let schedule = { day: this.days[dayIndex], ano: currentSchedule.ano, userEntityId: currentSchedule.userEntityId, week: currentSchedule.week, fechaWorking: currentSchedule.fechaWorking, horaInicio: '', horaFin: '', editable: false };
    /* let data = [...this.Datos[dayIndex], schedule]; */
    let data = [];
    for (let i = 0; i < this.nuevoHorario.length; i++) {
      if (i == dayIndex) {
        data.push([...this.nuevoHorario[i], schedule]);
      } else {
        data.push(this.nuevoHorario[i]);
      }
    }

    this.nuevoHorario = data;
    console.log('datos', this.nuevoHorario);
  }

  guardarValoresInFin(dayIndex: number, dayScheduleIndex: number, object: any, event: any) {
    console.log('hora inicio', object.horaInicio);
    let horasInicioFiltradas = this.listHoraInicio.
      filter(item => item.dia === object.day).
      map(item => item.horaInicio);

    if (horasInicioFiltradas.length) {
      this.horaInicio = horasInicioFiltradas[0];
    } else {
      this.horaInicio = object.horaInicio
    }

    /* if (this.horaInicio && event.value) {
      if (!this.validateHorario(object.day, this.horaInicio, event.value)) return;
    } */


    this.mHorario = {
      horaInicio: object.horaInicio as string,
      horaFin: object.horaFin as string,
      week: object.week,
      userEntityId: object.userEntityId,
      day: object.day,
      ano: object.ano,
      fechaWorking:object.fechaWorking,
      editable: object.editable
    };

    console.log(this.mHorario)
    /* let index = this.mHorarioList.findIndex(
      (mHorario) => mHorario.day === this.mHorario.day
    ); */

    /* if (index !== -1) {
      console.log('reemplazo') */
      this.mHorarioList[dayIndex][dayScheduleIndex] = this.mHorario;
    /* } else {
      console.log('nuevo')
      this.mHorarioList.push(this.mHorario);
    } */
  }

  actualizarHorario() {
    /* console.log(this.listHoraInicio);
    
    if (this.listHoraInicio.length) {
      for (let element of this.listHoraInicio) {
        let index = this.mHorarioList.findIndex(
          (mHorario) => mHorario.day === element.dia
        );
        this.mHorarioList[index].horaInicio = element.horaInicio;
      }
    } */

    if (this.mHorarioList.length) {
      let valid = this.validateHorarios();
      if (!valid) return;

      let data: any[] = [];
      for (let dayData of this.mHorarioList) {
        data = [...data, ...dayData.filter((horario: any) => horario.horaInicio !== '' && horario.horaFin !== '' && horario.editable)];
      }
      
      this.horarioCreate
        .PostCreateHorario(data)

        .subscribe((data) => {
          if (data.data) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizacion completada correctamente.',
              confirmButtonColor: '#0A6EBD',
            });
            this.dialogRef.close();
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error, esta intentando cargar un horario vacio.',
        confirmButtonColor: '#0A6EBD',
      });
    }


  }


  miFuncion(event: any, day: string) {
    let diaHoraInicio = { horaInicio: event.value, dia: day };
    console.log(diaHoraInicio)

    let index = this.listHoraInicio.findIndex(
      (elemento) => elemento.dia === diaHoraInicio.dia
    );

    if (index !== -1) {
      console.log('reemplazo')
      this.listHoraInicio[index] = diaHoraInicio;
    } else {
      console.log('nuevo')
      this.listHoraInicio.push(diaHoraInicio)
    }
    console.log(this.listHoraInicio, 'evento');
  }

  ngOnInit() {
    this.horario = this.data.horario;
    console.log('horario', this.horario);
    this.verificacionDias(this.horario);
  }


  verificacionDias(horarios: MCreateHorario[]) {

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
          fechaWorking:fechaWorking
        });
      }

      date.setUTCDate(date.getUTCDate() + 1);
    });

    horarios.sort((a: any, b: any) => diasSemana.indexOf(a.day) - diasSemana.indexOf(b.day));

    /* console.log(horarios, 'antes de Mhorariolist')
    for (let element of horarios) {
      this.mHorarioList.push(element)

      console.log(this.mHorarioList, 'mHorarioList')
    } */

    let data: any[] = [[],[],[],[],[],[],[]];
    for (let i = 0; i < horarios.length; i++) {
      let schedule = horarios[i];
      let dayIndex = this.days.findIndex(x => x == schedule.day);
      data[dayIndex] = [...data[dayIndex], { ...schedule, editable: schedule.horaInicio !== '' && schedule.horaFin !== '' }];
    }
    this.nuevoHorario = data;
    this.mHorarioList = data;
    /* this.nuevoHorario = horarios.map(horario => {
      return { ...horario, editable: horario.horaInicio !== '' && horario.horaFin !== '' };
    });*/

  }

  cancelar(){
    this.dialogRef.close();
  }

}
