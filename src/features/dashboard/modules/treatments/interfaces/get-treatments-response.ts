import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetTreatmentsResponse extends TBaseResponse<IGetTreatmentsResponseData> {}

export interface IGetTreatmentsResponseData extends TPaginationResponse<ITreatmentsItems> {}

export interface ITreatmentsItems {
    idTreatment: number;
    name: string;
    description: string | null;
    isActive: boolean;
}