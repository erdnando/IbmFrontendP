import { Guid } from "guid-typescript";
import { MCountryEntity } from "./MCountryEntiry";
import { MRol } from "./MRol"


export interface MetricasCarga{

    eN_PROCESO_ARP:string;
    ​​eN_PROCESO_STE:string;
    ​​eN_PROCESO_TSE:string;
    ​​mensaje:string;
    ​​nO_APLICA_X_HORARIO_ARP:string;
    ​​nO_APLICA_X_HORARIO_STE:string;
    ​​nO_APLICA_X_HORARIO_TSE: string;
    ​​nO_APLICA_X_OVERLAPING_ARP: string;
    ​​nO_APLICA_X_OVERLAPING_STE: string;
    ​​nO_APLICA_X_OVERLAPING_TSE: string;
    ​​nO_APLICA_X_OVERTIME_ARP: string;
    ​​nO_APLICA_X_OVERTIME_STE: string;
    ​​nO_APLICA_X_OVERTIME_TSE: string;
    idCarga: Guid;
}


export interface MSummary {
    statusCode: number
    succes: boolean
    message: any
    data: MetricasCarga
  }

  export interface MResponseLoadGuid {
    statusCode: number
    succes: boolean
    message: any
    data: string
  }

  export interface MResponseNotificaciones {
    statusCode: number
    succes: boolean
    message: any
    data: boolean
  }