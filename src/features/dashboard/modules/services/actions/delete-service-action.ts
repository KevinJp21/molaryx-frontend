'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";

export const apiDeleteServiceAction = async (
  idService: number,
): Promise<TBaseResponse<boolean>> => {
  const SERVICE = process.env.SERVICE;
  const DELETE_SERVICE = process.env.DELETE_SERVICE;

  const query = new URLSearchParams();
  query.append("IdService", idService.toString());

  const url = `${SERVICE}${DELETE_SERVICE}?${query.toString()}`;

  try {
    const response = await serverApi.delete<TBaseResponse<boolean>>(url);

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const { message } = await handleApiError(error);
    return {
      success: false,
      message,
    };
  }
};
