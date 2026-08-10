import { BaseResponse } from "@/types";

export interface IPostSignInResponse extends BaseResponse<IPostSignInResponseData>{}

export interface IPostSignInResponseData{
    auth_token: string;
    refresh_token: string;
}

export interface IPostSignInFormRequest {
    email: string;
    password: string;
}