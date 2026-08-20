import { TBaseResponse } from "@/types";

export interface IGetPaymentsSummaryResponse extends TBaseResponse<IGetPaymentsSummaryResponseData> {}

export interface IGetPaymentsSummaryResponseData {
    currentMonthRevenue: number;
    revenueOverTime: IRevenueOverTime[];
    paymentMethods: IPaymentsMethods[];
}

export interface IRevenueOverTime {
    year: number;
    month: number;
    revenue: number;
}

export interface IPaymentsMethods {
    idPaymentMethod: number;
    paymentMethod: string;
    amount: number;
    paymentCount: number;
}