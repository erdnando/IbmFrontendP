import { Guid } from "guid-typescript";

export interface MCreateHorario{

  userEntityId: string;
  week: string;
  horaInicio: string;
  horaFin: string;
  day: string;
  ano: string;
  fechaWorking: string;

}


export interface MCreateHorarioEditable{

  userEntityId: string;
  week: string;
  horaInicio: string;
  horaFin: string;
  day: string;
  ano: string;
  fechaWorking: string;
  editable:boolean

}