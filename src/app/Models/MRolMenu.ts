import { Guid } from "guid-typescript";
import { MRol } from "./MRol";
import { MMenu } from "./MMenu";

export interface MRolMenu{

  idRoleMenu:Guid;
  roleId:Guid;
  role:MRol
  menuEntityId:Guid;
  menuEntity:MMenu,



}
