"use server";
import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetTeamResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetTeamParams = TPaginationParams & {
  IdUserStatus?: number;
  IdUserRoles?: number[];
  Search?: string;
};

export const apiGetTeamAction = async (
  params: TGetTeamParams,
): Promise<IGetTeamResponse> => {
  const USER = process.env.USER;
  const GET_TEAM = process.env.GET_TEAM;

  const { Page, Size, IdUserStatus, IdUserRoles, Search } = params ?? {};

  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
  if (IdUserStatus) query.append("IdUserStatus", IdUserStatus.toString());
  if (Search) query.append("Search", Search);
  IdUserRoles?.forEach((roleId) => {
    query.append("IdUserRoles", roleId.toString());
  });

  const url = `${USER}${GET_TEAM}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetTeamResponse>(url);

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
