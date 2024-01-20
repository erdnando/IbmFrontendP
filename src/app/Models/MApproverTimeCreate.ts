import { Guid } from "guid-typescript";
import { MCreateHorusReport } from "./MHorusReport";
import { MUserEntity } from "./MUserEntity";
import { MListHorusReport } from "./MListHorusReport";

export interface MApproverTimeCreate {
    userId: Guid;
    horusReportEntityId: Guid;
    state: number;
    description: string;
    aprobador1UserEntityId: Guid;
    aprobador2UserEntityId: Guid;
    empleadoUserEntityId: Guid;
    roleAprobador:string;
  }