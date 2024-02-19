import { Guid } from "guid-typescript";



export interface MUserCreate{

    idUser:Guid;
    nameUser:string;
    surnameUser: string;
    email: string;
    password: string;
    employeeCode: string;
    roleEntityId: Guid;
    countryEntityId: Guid;
    idUserEntiyId:string;
}