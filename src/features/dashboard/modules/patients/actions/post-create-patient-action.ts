'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPostCreatePatientFormRequest } from "../interfaces";

export const apiPostCreatePatientAction = async (
  data: IPostCreatePatientFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const PATIENT = process.env.PATIENT;
  const POST_CREATE_PATIENT = process.env.POST_CREATE_PATIENT;

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${PATIENT}${POST_CREATE_PATIENT}`,
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
