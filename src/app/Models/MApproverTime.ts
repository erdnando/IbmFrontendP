import { Guid } from "guid-typescript";
import { MCreateHorusReport } from "./MHorusReport";
import { MUserEntity } from "./MUserEntity";
import { MListHorusReport } from "./MListHorusReport";
import { MAssignmentReports } from "./MAssignmentReports";

export interface MApproverTime {
    idAssignmentReport: Guid;
    userEntity: MUserEntity;
    userEntityId: Guid;
    horusReportEntity: MListHorusReport;
    horusReportEntityId: Guid;
    state: number;
    description: string;
    dateApprovalCancellation: Date;
  }