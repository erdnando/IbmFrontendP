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
    arP_CARGA:string;
    stE_CARGA:string;
    tsE_CARGA:string;
    idCarga: Guid;
    arpOmitidosXDuplicidad:string;
    tseOmitidosXDuplicidad:string;
    steOmitidosXDuplicidad:string;
    arpxDatosNovalidos:string;
    tsexDatosNovalidos:string;
    stexDatosNovalidos:string;
}

export interface MetricasCargaFinal{
  ​​mensaje:string;
  registroS_PORTALDB: string;
  nO_APLICA_X_OVERLAPING_ARP: string;
  nO_APLICA_X_OVERLAPING_STE: string;
  nO_APLICA_X_OVERLAPING_TSE: string;
}


export interface MSummary {
    statusCode: number
    succes: boolean
    message: any
    data: MetricasCarga
  }

  export interface MSummaryFinal {
    statusCode: number
    succes: boolean
    message: any
    data: MetricasCargaFinal
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

  export interface MResponseOverlapingPortalDB {
    statusCode: number
    succes: boolean
    message: any
    data: boolean
  }