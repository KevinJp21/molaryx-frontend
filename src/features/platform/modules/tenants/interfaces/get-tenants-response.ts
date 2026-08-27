import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetTenantsResponse
  extends TBaseResponse<IGetTenantsResponseData> {}

export interface IGetTenantsResponseData
  extends TPaginationResponse<ITenantsItems> {}

export interface ITenantsItems {
  idTenant: number;
  idIdentificationType: number | null;
  identificationNumber: string | null;
  identificationCode: string;
  consultoryName: string;
  email: string;
  phoneNumber: string;
  address: string;
  idTenantType: number;
  tenantTypeCode: string;
  idTenantStatus: number;
  tenantStatusName: string;
  owner: ITenantOwner | null;
  subscription: ITenantSubscriptionSummary | null;
}

export interface ITenantOwner {
  idUser: number;
  username: string;
  name: string;
  idIdentificationType: number;
  identificationCode: string;
  identificationNumber: string;
  phoneNumber: string;
  email: string;
}

export interface ITenantSubscriptionSummary {
  idTenantSubscription: number;
  idTenant: number;
  idTenantSubscriptionStatus: number;
  statusName: string;
  idPlan: number;
  planName: string;
  price: number;
  maxProfessionals: number | null;
  maxAssistants: number | null;
  maxPatients: number | null;
  startsAt: string | null;
  endsAt: string | null;
  daysRemaining: number | null;
  promotionEndsAt: string | null;
  isPromotionActive: boolean;
}
