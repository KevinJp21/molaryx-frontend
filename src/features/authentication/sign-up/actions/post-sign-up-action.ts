"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostSignUpFormRequest } from "../interfaces";
import { BaseResponse } from "@/types";

export const apiPostSignUpAction = async (
  data: IPostSignUpFormRequest,
): Promise<BaseResponse<boolean>> => {
  const AUTH = process.env.AUTH;
  const SIGN_UP = process.env.SIGN_UP;

  try {
    const response = await serverApi.post<BaseResponse<boolean>>(
      `${AUTH}${SIGN_UP}`,
      data,
    );
    return { success: true, message: response.data?.message };
  } catch (error) {
    const { message, error: errorResponse } = await handleApiError(error);
    return { success: false, message, error: errorResponse };
  }
};
