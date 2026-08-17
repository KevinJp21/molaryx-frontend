'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";

export const apiDeleteTreatmentAction = async (
  idTreatment: number,
): Promise<TBaseResponse<boolean>> => {
  const TREATMENT = process.env.TREATMENT;
  const DELETE_TREATMENT = process.env.DELETE_TREATMENT;

  const query = new URLSearchParams();
  query.append("IdTreatment", idTreatment.toString());

  const url = `${TREATMENT}${DELETE_TREATMENT}?${query.toString()}`;

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
