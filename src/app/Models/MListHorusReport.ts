import { Guid } from "guid-typescript";
import { MUserEntity } from "./MUserEntity";
import { MClientEntity } from "./MClienteEntity";
import { dateSelectionJoinTransformer } from "@fullcalendar/core/internal";
import { MCountryEntity } from "./MCountryEntiry";

export interface MListHorusReport{

  numberReport: any;
  strReport: string;
  idHorusReport: Guid;
  userEntityId : Guid;
  userEntity : MUserEntity;
  startDate : Date;
  clientEntityId : Guid;
  clientEntity: MClientEntity
  description : string;
  creationDate :Date;
  strCreationDate :string;
  acitivity: number;
  countHours: string;
  approverId: string;
  startTime: string;
  endTime: string;
  strStartDate : string;
  countryEntity: MCountryEntity;
  
}
