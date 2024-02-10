
import { MClientEntity } from "./MClienteEntity";
import { MCountryEntity } from "./MCountryEntiry";
import { MUserEntity } from "./MUserEntity";

export interface MPopUpHistory {

    numeroreporte: number;
    strNumeroreporte: string;
    horas: string;
    clientEntity: MClientEntity;
    userEntity:MUserEntity;
    fechaenvio: Date;
    actividad: number;
    activity: number;
    aprobaador1: string;
    aprobaador2: string;
    estadoReporte: number;
    observaciones: string;
    pais: MCountryEntity;

}