"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetProfileResponse } from "../interfaces";

const profileEndpoint = () => `${process.env.USER}${process.env.GET_PROFILE}`;

export const apiGetProfileAction = async (): Promise<IGetProfileResponse> => {
  try {
    const response = await serverApi.get<IGetProfileResponse>(profileEndpoint());

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
