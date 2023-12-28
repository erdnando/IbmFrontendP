import { Guid } from "guid-typescript";
import { MUserEntity } from "./MUserEntity";
import { MClientEntity } from "./MClienteEntity";
import { dateSelectionJoinTransformer } from "@fullcalendar/core/internal";
import { MCountryEntity } from "./MCountryEntiry";

export interface MListHorusReport{

  numberReport: any;
  idHorusReport: Guid;
  userEntityId : Guid;
  userEntity : MUserEntity;
  startDate : Date;
  clientEntityId : Guid;
  clientEntity: MClientEntity
  description : string;
  creationDate :Date;
  acitivity: number;
  countHours: string;
  approverId: string;
  startTime: string;
  countryEntity: MCountryEntity;

}
