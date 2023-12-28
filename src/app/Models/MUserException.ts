import { Guid } from "guid-typescript";
import { MUserEntity } from "./MUserEntity";

export interface MUserException{

  userid:Guid;
  idUsersExceptions:Guid;
  assignedUserId:Guid;
  startDate:Date,
  horas:number;
  description:string;
  user: MUserEntity;

}
