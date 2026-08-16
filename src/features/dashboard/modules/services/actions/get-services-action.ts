'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetServicesResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetServicesParams = TPaginationParams & {
  IsActive?: boolean;
};

export const apiGetServicesAction = async (
  params?: TGetServicesParams,
): Promise<IGetServicesResponse> => {
  const SERVICE = process.env.SERVICE;
  const GET_SERVICES = process.env.GET_SERVICES;

  const { Page, Size, IsActive } = params ?? {};

  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
  if (IsActive !== undefined) query.append("IsActive", IsActive.toString());

  const url = `${SERVICE}${GET_SERVICES}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetServicesResponse>(url);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    const { message } = await handleApiError(error);
    return {
      success: false,
      message,
    };
  }
};
