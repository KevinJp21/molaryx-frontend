'use server'

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetUserResponse } from "../interfaces/get-user-response";

export const apiGetUserAction = async (): Promise<IGetUserResponse> => {
  const AUTH = process.env.AUTH;
  const GET_USER = process.env.GET_USER;

  try {
    const response = await serverApi.get<IGetUserResponse>(`${AUTH}${GET_USER}`, {
      withScope: false,
    });

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };

  } catch (error) {
    const { message } = await handleApiError(error, { redirectOn401: false });
    return { success: false, message };
  }
};
