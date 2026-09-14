"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPostCreateBusinessTenantRequest } from "../interfaces";

export const apiPostCreateBusinessTenantAction = async (
  data: IPostCreateBusinessTenantRequest,
): Promise<TBaseResponse<boolean>> => {
  const PLATFORM_TENANT = process.env.PLATFORM_TENANT;
  const POST_CREATE_BUSINESS_TENANT = process.env.POST_CREATE_BUSINESS_TENANT;

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${PLATFORM_TENANT}${POST_CREATE_BUSINESS_TENANT}`,
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
