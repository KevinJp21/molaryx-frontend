"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { decodeId } from "@/utils/code-and-decode-id";
import { IGetPaymentsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetPaymentsParams = TPaginationParams &
  (
    | { IdPatient: string; IdPatientTreatment?: never }
    | { IdPatientTreatment: number; IdPatient?: never }
  );

export const apiGetPaymentsAction = async (
  params: TGetPaymentsParams,
): Promise<IGetPaymentsResponse> => {
  const PAYMENT = process.env.PAYMENT;
  const GET_PAYMENTS = process.env.GET_PAYMENTS;

  const { Page, Size } = params;
  const query = new URLSearchParams();

  if ("IdPatientTreatment" in params && params.IdPatientTreatment) {
    query.append("IdPatientTreatment", params.IdPatientTreatment.toString());
  } else if ("IdPatient" in params && params.IdPatient) {
    const idPatient = Number(decodeId(params.IdPatient));

    if (!idPatient) {
      return {
        success: false,
        message: "El paciente no es válido.",
      };
    }

    query.append("IdPatient", idPatient.toString());
  } else {
    return {
      success: false,
      message: "Indique solo un filtro: paciente o tratamiento del paciente.",
    };
  }

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());

  const url = `${PAYMENT}${GET_PAYMENTS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetPaymentsResponse>(url);
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
