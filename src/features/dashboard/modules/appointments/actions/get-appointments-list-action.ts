"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { decodeId } from "@/utils/code-and-decode-id";
import { IGetAppointmentsListResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetAppointmentsListParams = TPaginationParams & {
  IdPatient?: number | string;
  IdProfessional?: number;
  IdAppointmentStatus?: number;
};

export const apiGetAppointmentsListAction = async (
  params?: TGetAppointmentsListParams,
): Promise<IGetAppointmentsListResponse> => {
  const APPOINTMENT = process.env.APPOINTMENT;
  const GET_APPOINTMENTS_LIST = process.env.GET_APPOINTMENTS_LIST;

  const { Page, Size, IdPatient, IdProfessional, IdAppointmentStatus } =
    params ?? {};

  const query = new URLSearchParams();
  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
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
  if (IdProfessional) query.append("IdProfessional", IdProfessional.toString());
  if (IdAppointmentStatus) {
    query.append("IdAppointmentStatus", IdAppointmentStatus.toString());
  }

  const url = `${APPOINTMENT}${GET_APPOINTMENTS_LIST}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetAppointmentsListResponse>(url);
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
