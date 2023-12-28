import { Guid } from "guid-typescript";

export interface MAssignmentReports{

    idAssingmentReport:Guid;
    dateApprovalCancellation: Date;
    descripcion: string;
    state: number;
    userId: Guid;
    horusReportId: Guid;
}
