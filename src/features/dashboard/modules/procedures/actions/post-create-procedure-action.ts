'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPostCreateProcedureFormRequest } from "../interfaces";

export const apiPostCreateProcedureAction = async (
  data: IPostCreateProcedureFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const PROCEDURE = process.env.PROCEDURE;
  const POST_CREATE_PROCEDURE = process.env.POST_CREATE_PROCEDURE;

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${PROCEDURE}${POST_CREATE_PROCEDURE}`,
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
