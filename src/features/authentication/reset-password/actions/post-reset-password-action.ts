"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostResetPasswordFormRequest } from "../interfaces";
import { TBaseResponse } from "@/types";

export const apiPostResetPasswordAction = async (
  data: IPostResetPasswordFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const AUTH = process.env.AUTH;
  const RESET_PASSWORD = process.env.RESET_PASSWORD;

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${AUTH}${RESET_PASSWORD}`,
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
      message,
      error: errorResponse,
    };
  }
};
