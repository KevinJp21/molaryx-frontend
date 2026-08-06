export interface ISignUpFormRequest {
  idPlan: number | null;
  idPromotion: number | null;
  tenant: {
    idIdentificationType: number | null;
    identificationNumber: string;
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
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}
