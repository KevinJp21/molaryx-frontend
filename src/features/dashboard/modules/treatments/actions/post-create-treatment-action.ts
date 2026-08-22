'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPostCreateTreatmentFormRequest } from "../interfaces";

export const apiPostCreateTreatmentAction = async (
  data: IPostCreateTreatmentFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const TREATMENT = process.env.TREATMENT;
  const POST_CREATE_TREATMENT = process.env.POST_CREATE_TREATMENT;

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${TREATMENT}${POST_CREATE_TREATMENT}`,
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
