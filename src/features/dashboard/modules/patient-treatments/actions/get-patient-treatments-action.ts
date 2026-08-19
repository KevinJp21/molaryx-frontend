"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { decodeId } from "@/utils/code-and-decode-id";
import { IGetPatientTreatmentsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetPatientTreatmentsParams = TPaginationParams & {
  IdPatient?: number | string;
  Search?: string;
  IdPatientTreatmentStatus?: number;
};

export const apiGetPatientTreatmentsAction = async (
  params?: TGetPatientTreatmentsParams,
): Promise<IGetPatientTreatmentsResponse> => {
  const PATIENT_TREATMENT = process.env.PATIENT_TREATMENT;
  const GET_PATIENT_TREATMENTS = process.env.GET_PATIENT_TREATMENTS;

  const { Page, Size, IdPatient, Search, IdPatientTreatmentStatus } = params ?? {};
  const query = new URLSearchParams();

  if (IdPatient != null && IdPatient !== "") {
    const idPatient =
      typeof IdPatient === "number" ? IdPatient : Number(decodeId(IdPatient));

    if (!idPatient) {
      return {
        success: false,
        message: "El paciente no es válido.",
      };
    }

    query.append("IdPatient", idPatient.toString());
  }

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
  if (Search) query.append("Search", Search);
  if (IdPatientTreatmentStatus) {
    query.append("IdPatientTreatmentStatus", IdPatientTreatmentStatus.toString());
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
    const { message, error: errorResponse } = await handleApiError(error);
    return {
      success: false,
      message,
      error: errorResponse,
    };
  }
};
