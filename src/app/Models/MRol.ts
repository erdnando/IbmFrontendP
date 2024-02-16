import { Guid } from "guid-typescript";
import { MMenu } from "./MMenu";

export interface MRol{

    idRole:Guid;
    nameRole:string;
    menuEntity:MMenu [];
    idUserEntiyId:string;
}
