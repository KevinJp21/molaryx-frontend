export interface IPostCreateBusinessTenantRequest {
  plan: {
    price: number;
    maxProfessionals: number;
    maxAssistants: number;
    maxPatients: number;
  };
  tenant: {
    idIdentificationType: number | null;
    identificationNumber: string | null;
    consultoryName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  owner: {
    username: string;
    firstName: string;
    secondName: string | null;
    firstSurname: string;
    secondSurname: string | null;
    idIdentificationType: number;
    identificationNumber: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
    password: string;
  };
}
