"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetPublicPlansResponse, IGetPublicPlans } from "../interfaces/get-public-plans-response";

export const apiGetPublicPlansAction = async (): Promise<{
    success: boolean;
    data?: IGetPublicPlans[];
    message?: string;
}> => {
    const PLAN = process.env.PLAN;
    const GET_PUBLIC_PLANS = process.env.GET_PUBLIC_PLANS;

    try {
        const response = await serverApi.get<IGetPublicPlansResponse>(
            `${PLAN}${GET_PUBLIC_PLANS}`,
            { withScope: false },
        );
        return {
            success: true,
            data: response.data.data ?? undefined,
            message: response.data.message,
        };
    } catch (error) {
        const { message } = await handleApiError(error);
        return { success: false, message };
    }
};
