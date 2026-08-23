'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPutUpdateProcedureFormRequest } from "../interfaces";

export const apiPutUpdateProcedureAction = async (
  data: IPutUpdateProcedureFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const PROCEDURE = process.env.PROCEDURE;
  const PUT_UPDATE_PROCEDURE = process.env.PUT_UPDATE_PROCEDURE;

  try {
    const response = await serverApi.put<TBaseResponse<boolean>>(
      `${PROCEDURE}${PUT_UPDATE_PROCEDURE}`,
      data,
    );

    return {
      success: true,
      message: response.data.message,
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
