"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPutUpdateMemberFormRequest } from "../interfaces";

export const apiPutUpdateMemberAction = async (
  data: IPutUpdateMemberFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const USER = process.env.USER;
  const PUT_UPDATE_MEMBER = process.env.PUT_UPDATE_MEMBER;

  try {
    const response = await serverApi.put<TBaseResponse<boolean>>(
      `${USER}${PUT_UPDATE_MEMBER}`,
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
