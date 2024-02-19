import { Guid } from "guid-typescript"

export interface MAprobador {
  idAprobador: Guid;
  descripcion: string;
  nivel: number;
  idUserEntiyId:string;
}
