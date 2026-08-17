"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { decodeId } from "@/utils/code-and-decode-id";
import { IGetPatientTreatmentsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetPatientTreatmentsParams = TPaginationParams & {
  IdPatient: string;
  IdTreatmentStatus?: number;
};

export const apiGetPatientTreatmentsAction = async (
  params: TGetPatientTreatmentsParams,
): Promise<IGetPatientTreatmentsResponse> => {
  const PATIENT_TREATMENT = process.env.PATIENT_TREATMENT;
  const GET_PATIENT_TREATMENTS = process.env.GET_PATIENT_TREATMENTS;

  const { Page, Size, IdPatient, IdTreatmentStatus } = params;
  const idPatient = Number(decodeId(IdPatient));

  if (!idPatient) {
    return {
      success: false,
      message: "El paciente no es válido.",
    };
  }

  const query = new URLSearchParams();
  query.append("IdPatient", idPatient.toString());
  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
  if (IdTreatmentStatus) {
    query.append("IdTreatmentStatus", IdTreatmentStatus.toString());
  }

  const url = `${PATIENT_TREATMENT}${GET_PATIENT_TREATMENTS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetPatientTreatmentsResponse>(url);
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
