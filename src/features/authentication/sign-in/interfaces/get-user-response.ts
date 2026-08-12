import { BaseResponse } from "@/types";

export interface IGetUserResponse extends BaseResponse<IGetUserResponseData> {}

export interface IGetUserResponseData {
    role: IRole;
    idTenant: string;
    status: IStatus;
    username: string;
    names: string;
    surnames: string;
    email: string;
    permissions: IPermission[];
}

interface IRole {
    idUserRole: string;
    name: string;
}

interface IStatus {
    idUserStatus: string;
    name: string;
}

interface IPermission {
    module: string;
    codes: string[];
}