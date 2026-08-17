"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPutUpdatePatientTreatmentFormRequest } from "../interfaces";

export const apiPutUpdatePatientTreatmentAction = async (
  data: IPutUpdatePatientTreatmentFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const PATIENT_TREATMENT = process.env.PATIENT_TREATMENT;
  const PUT_UPDATE_PATIENT_TREATMENT = process.env.PUT_UPDATE_PATIENT_TREATMENT;

  try {
    const response = await serverApi.put<TBaseResponse<boolean>>(
      `${PATIENT_TREATMENT}${PUT_UPDATE_PATIENT_TREATMENT}`,
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
