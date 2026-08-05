"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TMasterListResponse } from "../types";

export const apiGetMaster = async <TIdKey extends string>(
  endpoint: string = "",
): Promise<{
  success: boolean;
  data?: TMasterListResponse<TIdKey>;
  error?: string;
}> => {
  const MASTERS = process.env.MASTERS;
  try {
    const response = await serverApi.get<TMasterListResponse<TIdKey>>(
      `${MASTERS}${endpoint}`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

export const apiGetIdentificationTypes = async () => {
  const GET_IDENTIFICATION_TYPES = process.env.GET_IDENTIFICATION_TYPES;
  return apiGetMaster<"idIdentificationType">(GET_IDENTIFICATION_TYPES);
};
