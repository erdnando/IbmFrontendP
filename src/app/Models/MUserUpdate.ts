import { Guid } from "guid-typescript";



export interface MUserUpdate{

    idUser:Guid;
    nameUser:string;
    surnameUser: string;
    email: string;
}