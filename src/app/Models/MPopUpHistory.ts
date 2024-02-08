
import { MClientEntity } from "./MClienteEntity";
import { MCountryEntity } from "./MCountryEntiry";

export interface MPopUpHistory {

    numeroreporte: number;
    strNumeroreporte: string;
    horas: string;
    clientEntity: MClientEntity;
    fechaenvio: Date;
    actividad: number;
    activity: number;
    aprobaador1: string;
    aprobaador2: string;
    estadoAprobadorNIvel1: number;
    estadoAprobadorNIvel2: number;
    observaciones: string;
    pais: MCountryEntity;

}