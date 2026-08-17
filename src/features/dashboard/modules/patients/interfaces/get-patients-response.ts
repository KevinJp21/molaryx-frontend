import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetPatientsResponse extends TBaseResponse<IGetPatientsResponseData> {}

export interface IGetPatientsResponseData extends TPaginationResponse<IPatientsItems> {}

export interface IPatientsItems {
    idPatient: number;
    encodedId?: string;
    idIdentificationType: number;
    identificationType: string;
    identificationNumber: string;
    firstName: string;
    secondName: string;
    firstSurname: string;
    secondSurname: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}