"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetPaymentsSummaryByConceptResponse } from "../interfaces";

export type TGetPaymentsSummaryByConceptParams = {
  IdAppointment?: number;
  IdPatientTreatment?: number;
};

export const apiGetPaymentsSummaryByConceptAction = async (
  params: TGetPaymentsSummaryByConceptParams,
): Promise<IGetPaymentsSummaryByConceptResponse> => {
  const PAYMENT = process.env.PAYMENT;
  const GET_PAYMENTS_SUMMARY_BY_CONCEPT =
    process.env.GET_PAYMENTS_SUMMARY_BY_CONCEPT;

  const { IdAppointment, IdPatientTreatment } = params;
  const hasAppointment = Boolean(IdAppointment);
  const hasTreatment = Boolean(IdPatientTreatment);

  if (hasAppointment === hasTreatment) {
    return {
      success: false,
      message:
        "Indique exactamente un concepto: cita o tratamiento del paciente.",
    };
  }

  const query = new URLSearchParams();
  if (IdAppointment) {
    query.append("IdAppointment", IdAppointment.toString());
  }
  if (IdPatientTreatment) {
    query.append("IdPatientTreatment", IdPatientTreatment.toString());
  }

  const url = `${PAYMENT}${GET_PAYMENTS_SUMMARY_BY_CONCEPT}?${query.toString()}`;

  try {
    const response =
      await serverApi.get<IGetPaymentsSummaryByConceptResponse>(url);
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
