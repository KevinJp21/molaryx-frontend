"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetPaymentsSummaryResponse } from "../interfaces";

export const apiGetPaymentsSummaryAction =
  async (): Promise<IGetPaymentsSummaryResponse> => {
    const DASHBOARD = process.env.DASHBOARD;
    const GET_PAYMENTS_SUMMARY = process.env.GET_PAYMENTS_SUMMARY;

    try {
      const response = await serverApi.get<IGetPaymentsSummaryResponse>(
        `${DASHBOARD}${GET_PAYMENTS_SUMMARY}`,
      );

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      const { message } = await handleApiError(error);

      return {
        success: false,
        message,
      };
    }
  };
