'use server';

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IGetPatientsResponse } from "../interfaces";
import { TPaginationParams } from "@/types";

export type TGetPatientsParams = TPaginationParams & {};

export const apiGetPatientsAction = async (
  params?: TGetPatientsParams,
): Promise<IGetPatientsResponse> => {
  const PATIENT = process.env.PATIENT;
  const GET_PATIENTS = process.env.GET_PATIENTS;

  const { Page, Size } = params ?? {};

  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());

  const url = `${PATIENT}${GET_PATIENTS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetPatientsResponse>(url);
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
