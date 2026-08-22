"use server";
import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetAppointmentsResponse } from "../interfaces";

export type TGetAppointmentsParams = {
  From: string;
  To: string;
  IdProfessional?: number;
};

export const apiGetAppointmentsAction = async (
  params: TGetAppointmentsParams,
): Promise<IGetAppointmentsResponse> => {
  const APPOINTMENT = process.env.APPOINTMENT;
  const GET_APPOINTMENTS = process.env.GET_APPOINTMENTS;

  const query = new URLSearchParams();
  query.append("From", params.From);
  query.append("To", params.To);
  if (params?.IdProfessional) query.append("IdProfessional", params.IdProfessional.toString());

  const url = `${APPOINTMENT}${GET_APPOINTMENTS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetAppointmentsResponse>(url);

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    const { message, error: errorResponse } = await handleApiError(error);

    return {
      success: false,
      message: message,
      error: errorResponse,
    };
  }
};
