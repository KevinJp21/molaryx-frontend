'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetTreatmentsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetTreatmentsParams = TPaginationParams & {
  IsActive?: boolean;
};

export const apiGetTreatmentsAction = async (
  params?: TGetTreatmentsParams,
): Promise<IGetTreatmentsResponse> => {
  const TREATMENT = process.env.TREATMENT;
  const GET_TREATMENTS = process.env.GET_TREATMENTS;

  const { Page, Size, IsActive } = params ?? {};

  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
  if (IsActive !== undefined) query.append("IsActive", IsActive.toString());

  const url = `${TREATMENT}${GET_TREATMENTS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetTreatmentsResponse>(url);
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
