import { Guid } from "guid-typescript";
import { MCountryEntity } from "./MCountryEntiry";

export interface MFestivos {

    idFestivo: string;
    descripcion: string;
    diaFestivo: string;
    countryId: string;
    country: MCountryEntity;
    ano: string;
    idUserEntiyId: string;

}
