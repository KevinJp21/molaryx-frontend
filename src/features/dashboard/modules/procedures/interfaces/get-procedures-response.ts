import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetProceduresResponse extends TBaseResponse<IGetProceduresResponseData> {}

export interface IGetProceduresResponseData extends TPaginationResponse<IProceduresItems> {}

export interface IProceduresItems {
    idProcedure: number;
    name: string;
    description: string | null;
    referencePrice: number | null;
    isActive: boolean;
}
