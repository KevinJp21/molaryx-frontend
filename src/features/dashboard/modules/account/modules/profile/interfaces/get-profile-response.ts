import { TBaseResponse } from "@/types";

export interface IGetProfileResponse extends TBaseResponse<IGetProfileResponseData> {}

export interface IGetProfileResponseData {
  idUser: number;
  username: string;
  firstName: string;
  secondName: string | null;
  firstSurname: string;
  secondSurname: string | null;
  idIdentificationType: number;
  identificationType: string;
  identificationNumber: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  idUserRole: number;
  roleName: string;
  idUserStatus: number;
  statusName: string;
  tenant: IProfileTenantSummary | null;
}

export interface IProfileTenantSummary {
  consultoryName: string;
  email: string;
  phoneNumber: string;
  address: string;
  idIdentificationType: number | null;
  identificationType: string | null;
  identificationNumber: string | null;
}
