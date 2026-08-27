"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPutUpdateTenantRequest } from "../interfaces";

export const apiPutUpdateTenantAction = async (
  data: IPutUpdateTenantRequest,
): Promise<TBaseResponse<boolean>> => {
  const PLATFORM_TENANT = process.env.PLATFORM_TENANT;
  const PUT_UPDATE_TENANT = process.env.PUT_UPDATE_TENANT;

  try {
    const response = await serverApi.put<TBaseResponse<boolean>>(
      `${PLATFORM_TENANT}${PUT_UPDATE_TENANT}`,
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
