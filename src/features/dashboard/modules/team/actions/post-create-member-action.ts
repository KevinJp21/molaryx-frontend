'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostCreateMemberFormRequest } from "../interfaces";
import { TBaseResponse } from "@/types";

export const apiPostCreateMemberAction = async (
  data: IPostCreateMemberFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const USER = process.env.USER;
  const POST_CREATE_MEMBER = process.env.POST_CREATE_MEMBER;

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${USER}${POST_CREATE_MEMBER}`,
      data,
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
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
