'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPutUpdateServiceFormRequest } from "../interfaces";

export const apiPutUpdateServiceAction = async (
  data: IPutUpdateServiceFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const SERVICE = process.env.SERVICE;
  const PUT_UPDATE_SERVICE = process.env.PUT_UPDATE_SERVICE;

  try {
    const response = await serverApi.put<TBaseResponse<boolean>>(
      `${SERVICE}${PUT_UPDATE_SERVICE}`,
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
