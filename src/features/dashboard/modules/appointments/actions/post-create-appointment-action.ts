"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostAppointmentFormRequest } from "../interfaces";
import { TBaseResponse } from "@/types";

export const apiPostCreateAppointmentAction = async (
  data: IPostAppointmentFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const APPOINTMENT = process.env.APPOINTMENT;
  const POST_CREATE_APPOINTMENT = process.env.POST_CREATE_APPOINTMENT;

  console.log(data);

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${APPOINTMENT}${POST_CREATE_APPOINTMENT}`,
      data,
    );

    console.log(response);

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
