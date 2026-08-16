"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPutUpdateAppointmentFormRequest } from "../interfaces";
import { TBaseResponse } from "@/types";

export const apiPutUpdateAppointmentAction = async (
  data: IPutUpdateAppointmentFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const APPOINTMENT = process.env.APPOINTMENT;
  const PUT_UPDATE_APPOINTMENT = process.env.PUT_UPDATE_APPOINTMENT;

  try {
    const response = await serverApi.put<TBaseResponse<boolean>>(
      `${APPOINTMENT}${PUT_UPDATE_APPOINTMENT}`,
      data,
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const { message, error: errorResponse } = await handleApiError(error);
    return {
      success: false,
      message,
      error: errorResponse,
    };
  }
};
