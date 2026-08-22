import { TBaseResponse } from "@/types";
import { TPaginationResponse } from "@/types";

export interface IGetProfessionalsResponse extends TBaseResponse<TPaginationResponse<IGetProfessionalsResponseData>> {}

export interface IGetProfessionalsResponseData {
    idProfessional: number;
    idUser: number;
    idUserStatus: number;
    statusName: string;
    username: string;
    firstName: string;
    secondName: string;
    firstSurname: string;
    secondSurname: string;
    identificationType: string;
    identificationNumber: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
}