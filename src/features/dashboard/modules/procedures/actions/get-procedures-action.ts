'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetProceduresResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetProceduresParams = TPaginationParams & {
  IsActive?: boolean;
  Search?: string;
};

export const apiGetProceduresAction = async (
  params?: TGetProceduresParams,
): Promise<IGetProceduresResponse> => {
  const PROCEDURE = process.env.PROCEDURE;
  const GET_PROCEDURES = process.env.GET_PROCEDURES;

  const { Page, Size, IsActive, Search } = params ?? {};

  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
  if (IsActive !== undefined) query.append("IsActive", IsActive.toString());
  if (Search) query.append("Search", Search);

  const url = `${PROCEDURE}${GET_PROCEDURES}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetProceduresResponse>(url);
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
