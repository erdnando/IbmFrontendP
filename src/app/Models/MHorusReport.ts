import { Guid } from "guid-typescript";

export interface MCreateHorusReport{


  userEntityId: Guid;
  startDate : string;
  startTime : string;
  endTime : string;
  clientEntityId : Guid;
  description : string;
  tipoReporte :number;
  acitivity: number;
  countHours: string;
  approverId: string;
  numberReport: number;

}
