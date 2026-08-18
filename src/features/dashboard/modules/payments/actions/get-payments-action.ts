"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { decodeId } from "@/utils/code-and-decode-id";
import { IGetPaymentsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetPaymentsParams = TPaginationParams & {
  IdPatient?: string;
  IdPatientTreatment?: number;
  IdAppointment?: number;
};

export const apiGetPaymentsAction = async (
  params?: TGetPaymentsParams,
): Promise<IGetPaymentsResponse> => {
  const PAYMENT = process.env.PAYMENT;
  const GET_PAYMENTS = process.env.GET_PAYMENTS;

  const { Page, Size, IdPatient, IdPatientTreatment, IdAppointment } =
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
    const idPatient = Number(decodeId(IdPatient));

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
