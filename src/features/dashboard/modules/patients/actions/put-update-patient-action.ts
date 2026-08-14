'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPutUpdatePatientFormRequest } from "../interfaces";

export const apiPutUpdatePatientAction = async (
  data: IPutUpdatePatientFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const PATIENT = process.env.PATIENT;
  const PUT_UPDATE_PATIENT = process.env.PUT_UPDATE_PATIENT;

  try {
    const response = await serverApi.put<TBaseResponse<boolean>>(
      `${PATIENT}${PUT_UPDATE_PATIENT}`,
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
      message: message,
      error: errorResponse,
    };
  }
};
