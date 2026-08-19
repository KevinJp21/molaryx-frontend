"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPostCreatePatientTreatmentFormRequest } from "../interfaces";

export const apiPostCreatePatientTreatmentAction = async (
  data: IPostCreatePatientTreatmentFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const PATIENT_TREATMENT = process.env.PATIENT_TREATMENT;
  const POST_CREATE_PATIENT_TREATMENT =
    process.env.POST_CREATE_PATIENT_TREATMENT;

  if (!data.idPatient) {
    return {
      success: false,
      message: "El paciente no es válido.",
    };
  }

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${PATIENT_TREATMENT}${POST_CREATE_PATIENT_TREATMENT}`,
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
