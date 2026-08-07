"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostSignUpFormRequest } from "../interfaces";
import { BaseResponse } from "@/types";

export const apiPostSignUpAction = async (
  data: IPostSignUpFormRequest,
): Promise<{ success: boolean; message: string; error?: string }> => {
  const AUTH = process.env.AUTH;
  const POST_SIGN_UP = process.env.POST_SIGN_UP;

  try {
    const response = await serverApi.post<BaseResponse<boolean>>(
      `${AUTH}${POST_SIGN_UP}`,
      data,
    );
    return { success: true, message: response.data?.message };
  } catch (error) {
    const { message, error: errorResponse } = await handleApiError(error);
    return { success: false, message, error: errorResponse };
  }
};
