"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetClinicalRecordsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetClinicalRecordsParams = TPaginationParams & {
  IdPatient?: number;
  IdAppointment?: number;
  IdPatientTreatment?: number;
};

export const apiGetClinicalRecordsAction = async (
  params?: TGetClinicalRecordsParams,
): Promise<IGetClinicalRecordsResponse> => {
  const CLINICAL_RECORD = process.env.CLINICAL_RECORD;
  const GET_CLINICAL_RECORDS = process.env.GET_CLINICAL_RECORDS;

  const { Page, Size, IdPatient, IdAppointment, IdPatientTreatment } =
    params ?? {};
  const query = new URLSearchParams();

  const filters = [
    Boolean(IdAppointment),
    Boolean(IdPatientTreatment),
    Boolean(IdPatient),
  ].filter(Boolean).length;

  if (filters > 1) {
    return {
      success: false,
      message:
        "Indique como máximo un filtro: paciente, cita o tratamiento del paciente.",
    };
  }

  if (IdAppointment) {
    query.append("IdAppointment", IdAppointment.toString());
  } else if (IdPatientTreatment) {
    query.append("IdPatientTreatment", IdPatientTreatment.toString());
  } else if (IdPatient) {
    query.append("IdPatient", IdPatient.toString());
  }

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());

  const url = `${CLINICAL_RECORD}${GET_CLINICAL_RECORDS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetClinicalRecordsResponse>(url);
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
