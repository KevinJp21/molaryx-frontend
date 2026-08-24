"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostForgotPasswordFormRequest } from "../interfaces";
import { TBaseResponse } from "@/types";

export const apiPostForgotPasswordAction = async (
  data: IPostForgotPasswordFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const AUTH = process.env.AUTH;
  const FORGOT_PASSWORD = process.env.FORGOT_PASSWORD;

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${AUTH}${FORGOT_PASSWORD}`,
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
