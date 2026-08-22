import { TBaseResponse } from "@/types";

export interface IGetClinicalHistoryResponse extends TBaseResponse<Blob> {
    filename?: string;
}
