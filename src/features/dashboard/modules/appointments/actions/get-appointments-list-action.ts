"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetAppointmentsListResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetAppointmentsListParams = TPaginationParams & {
  IdPatient?: number;
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
  if (IdPatient) query.append("IdPatient", IdPatient.toString());
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
    const { message } = await handleApiError(error);
    return {
      success: false,
      message,
    };
  }
};
