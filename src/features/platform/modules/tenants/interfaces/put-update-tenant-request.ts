export interface IPutUpdateTenantRequest {
  idTenant: number;
  tenant: {
    idIdentificationType: number | null;
    identificationNumber: string | null;
    consultoryName: string | null;
    email: string | null;
    phoneNumber: string | null;
    address: string | null;
    idTenantStatus: number | null;
  } | null;
  owner: {
    idUser: number;
    username: string | null;
    firstName: string | null;
    secondName: string | null;
    firstSurname: string | null;
    secondSurname: string | null;
    idIdentificationType: number | null;
    identificationNumber: string | null;
    phoneNumber: string | null;
    email: string | null;
    idUserStatus: number | null;
  } | null;
  subscription: {
    idTenantSubscription: number;
    idTenantSubscriptionStatus: number | null;
    price: number | null;
    maxProfessionals: number | null;
    maxAssistants: number | null;
    maxPatients: number | null;
    startsAt: string | null;
    endsAt: string | null;
  } | null;
}
