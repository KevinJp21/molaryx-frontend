'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";

export const apiDeletePatientAction = async (
  idPatient: number,
): Promise<TBaseResponse<boolean>> => {
  const PATIENT = process.env.PATIENT;
  const DELETE_PATIENT = process.env.DELETE_PATIENT;

  const query = new URLSearchParams();
  query.append("IdPatient", idPatient.toString());

  const url = `${PATIENT}${DELETE_PATIENT}?${query.toString()}`;

  try {
    const response = await serverApi.delete<TBaseResponse<boolean>>(url);

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const { message } = await handleApiError(error);
    return {
      success: false,
      message,
    };
  }
};
