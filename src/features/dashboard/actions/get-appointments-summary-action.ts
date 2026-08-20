"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetAppointmentsSummaryResponse } from "../interfaces";

export const apiGetAppointmentsSummaryAction =
  async (): Promise<IGetAppointmentsSummaryResponse> => {
    const DASHBOARD = process.env.DASHBOARD;
    const GET_APPOINTMENTS_SUMMARY = process.env.GET_APPOINTMENTS_SUMMARY;

    try {
      const response = await serverApi.get<IGetAppointmentsSummaryResponse>(
        `${DASHBOARD}${GET_APPOINTMENTS_SUMMARY}`,
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
