'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";

export const apiDeleteProcedureAction = async (
  idProcedure: number,
): Promise<TBaseResponse<boolean>> => {
  const PROCEDURE = process.env.PROCEDURE;
  const DELETE_PROCEDURE = process.env.DELETE_PROCEDURE;

  const query = new URLSearchParams();
  query.append("IdProcedure", idProcedure.toString());

  const url = `${PROCEDURE}${DELETE_PROCEDURE}?${query.toString()}`;

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
