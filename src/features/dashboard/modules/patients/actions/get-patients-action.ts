'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { encodeId } from "@/utils/code-and-decode-id";
import { IGetPatientsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetPatientsParams = TPaginationParams & {
  IsActive?: boolean;
  Search?: string;
};

export const apiGetPatientsAction = async (
  params?: TGetPatientsParams,
): Promise<IGetPatientsResponse> => {
  const PATIENT = process.env.PATIENT;
  const GET_PATIENTS = process.env.GET_PATIENTS;

  const { Page, Size, IsActive, Search } = params ?? {};

  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());
  if (IsActive !== undefined) query.append("IsActive", IsActive.toString());
  if (Search) query.append("Search", Search);

  const url = `${PATIENT}${GET_PATIENTS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetPatientsResponse>(url);
    const data = response.data.data;

    return {
      success: true,
      message: response.data.message,
      data: data
        ? {
            ...data,
            items: data.items.map((item) => ({
              ...item,
              encodedId: encodeId(item.idPatient),
            })),
          }
        : data,
    };
  } catch (error) {
    const { message } = await handleApiError(error);
    return {
      success: false,
      message,
    };
  }
};
