import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetServicesResponse extends TBaseResponse<IGetServicesResponseData> {}

export interface IGetServicesResponseData extends TPaginationResponse<IServicesItems> {}

export interface IServicesItems {
    idService: number;
    name: string;
    description: string | null;
    isActive: boolean;
}