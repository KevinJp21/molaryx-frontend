"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPostCreateClinicalRecordFormRequest } from "../interfaces";

export const apiPostCreateClinicalRecordAction = async (
  data: IPostCreateClinicalRecordFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const CLINICAL_RECORD = process.env.CLINICAL_RECORD;
  const POST_CREATE_CLINICAL_RECORD = process.env.POST_CREATE_CLINICAL_RECORD;

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${CLINICAL_RECORD}${POST_CREATE_CLINICAL_RECORD}`,
      {
        idPatient: data.idPatient,
        idAppointment: data.idAppointment ?? null,
        idPatientTreatment: data.idPatientTreatment ?? null,
        idService: data.idService ?? null,
        recordedAt: data.recordedAt,
        reason: data.reason,
        diagnosis: data.diagnosis ?? null,
        evolution: data.evolution ?? null,
        notes: data.notes ?? null,
      },
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
