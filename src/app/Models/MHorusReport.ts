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

export interface MCreatePortalDB{
  idHorusReport:Guid;
  userEntityId: Guid;
  startDate : string;
  startTime : string;
  endTime : string;
  clientEntityId : Guid;
  description : string;
  creationDate: Date;
  tipoReporte :number;
  acitivity: number;
  countHours: string;
  approverId: string;
  numberReport: number;
  state:number;
  error: boolean;
  message: string;
  dateApprovalSystem:Date;
  countryId:Guid
}

export interface MPortalDBResponse {
  statusCode: number
  succes: boolean
  message: any
  data: MCreatePortalDB
}


// acitivity
// approverId
// clientEntityId
// countHours
// creationDate
// description
// endTime
// idPortalDb
// numberReport
// startDate
// startTime
// state
// tipoReporte
// userEntityId

