export interface IPostResetPasswordFormRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
