import { TBaseResponse } from "@/types";

export interface IGetUserResponse extends TBaseResponse<IGetUserResponseData> {}

export interface IGetUserResponseData {
    role: IRole;
    idTenant: string;
    status: IStatus;
    username: string;
    names: string;
    surnames: string;
    email: string;
    subscription: ISubscription | null;
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

interface ISubscription {
    planName: string;
    startsAt: string | null;
    endsAt: string | null;
    daysRemaining: number | null;
    statusName: string;
}