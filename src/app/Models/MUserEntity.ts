import { Guid } from "guid-typescript";
import { MCountryEntity } from "./MCountryEntiry";
import { MRol } from "./MRol"


export interface MUserEntity{

    idUser:Guid;
    nameUser:string;
    surnameUser: string;
    email: string;
    password: string;
    employeeCode: string;
    roleEntityId: Guid;
    countryEntityId: Guid;
    countryEntity: MCountryEntity;
    rolEntity: MRol;
}
