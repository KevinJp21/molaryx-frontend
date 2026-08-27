"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TPaginationParams } from "@/types";
import { IGetTenantsResponse } from "../interfaces";

export type TGetTenantsParams = TPaginationParams;

export const apiGetTenantsAction = async (
  params?: TGetTenantsParams,
): Promise<IGetTenantsResponse> => {
  const PLATFORM_TENANT = process.env.PLATFORM_TENANT;
  const GET_TENANTS = process.env.GET_TENANTS;

  const { Page, Size } = params ?? {};
  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());

  const url = `${PLATFORM_TENANT}${GET_TENANTS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetTenantsResponse>(url);

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
