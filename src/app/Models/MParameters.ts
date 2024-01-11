import { Guid } from "guid-typescript";

export interface MParameters{

    idParametersEntity:Guid;
    targetTimeDay: number;
    targetHourWeek: number;
    targetHourMonth:number;
    targetHourYear :number;
    typeLimits:number;
    typeHours:number;
    countryEntityId:Guid;
    empleadoUserEntityId:Guid;
}
