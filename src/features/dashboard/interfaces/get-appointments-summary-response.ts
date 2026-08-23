import { TBaseResponse } from "@/types";
export interface IGetAppointmentsSummaryResponse extends TBaseResponse<IGetAppointmentsSummaryResponseData> {}

export interface IGetAppointmentsSummaryResponseData {
    todayCount: number;
    byStatus: IByStatus[];
    topProcedures: ITopProcedures[];
    upcoming: IUpcoming[];
};

export interface IByStatus {
    idAppointmentStatus: number;
    appointmentStatus: string;
    count: number;
};

export interface ITopProcedures {
    idProcedure: number;
    procedureName: string;
    count: number;
};

export interface IUpcoming {
    idAppointment: number;
    startAt: string;
    endAt: string;
    patientName: string;
    patientSurname: string;
    procedureNames: string;
    professionalName: string;
    professionalSurname: string;
    idAppointmentStatus: string;
    appointmentStatus: string;
};
