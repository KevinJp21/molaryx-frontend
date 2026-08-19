"use server";
import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetProfessionalsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetProfessionalsParams = TPaginationParams & {
  IdUserStatus?: number;
  Search?: string;
};

export const apiGetProfessionalsAction = async (
  params: TGetProfessionalsParams,
): Promise<IGetProfessionalsResponse> => {
  const USER = process.env.USER;
  const GET_PROFESSIONALS = process.env.GET_PROFESSIONALS;

  const { Page, Size, IdUserStatus, Search } = params ?? {};

  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
  if (IdUserStatus) query.append("IdUserStatus", IdUserStatus.toString());
  if (Search) query.append("Search", Search);

  const url = `${USER}${GET_PROFESSIONALS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetProfessionalsResponse>(url);

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
