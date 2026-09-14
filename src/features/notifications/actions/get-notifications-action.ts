"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TPaginationParams } from "@/types";
import { IGetNotificationsResponse } from "../interfaces";

export type TGetNotificationsParams = TPaginationParams;

export const apiGetNotificationsAction = async (
  params?: TGetNotificationsParams,
): Promise<IGetNotificationsResponse> => {
  const NOTIFICATION = process.env.NOTIFICATION;
  const GET_NOTIFICATIONS = process.env.GET_NOTIFICATIONS;

  const { Page, Size } = params ?? {};
  const query = new URLSearchParams();

  if (Page) query.append("Page", Page.toString());
  if (Size) query.append("Size", Size.toString());

  const url = `${NOTIFICATION}${GET_NOTIFICATIONS}?${query.toString()}`;

  try {
    const response = await serverApi.get<IGetNotificationsResponse>(url);

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
