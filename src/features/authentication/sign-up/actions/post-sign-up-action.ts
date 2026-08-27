"use server";

import { headers } from "next/headers";
import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostSignUpFormRequest } from "../interfaces";
import { TBaseResponse } from "@/types";

export const apiPostSignUpAction = async (
  data: IPostSignUpFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const AUTH = process.env.AUTH;
  const SIGN_UP = process.env.SIGN_UP;
  const requestHeaders = await headers();

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${AUTH}${SIGN_UP}`,
      data,
      {
        headers: {
          "User-Agent": requestHeaders.get("user-agent") ?? "unknown",
          "X-Client-User-Agent": requestHeaders.get("user-agent") ?? "unknown",
          "X-Forwarded-For":
            requestHeaders.get("x-forwarded-for") ??
            requestHeaders.get("x-real-ip") ??
            "",
        },
      },
    );
    return { success: true, message: response.data?.message };
  } catch (error) {
    const { message, error: errorResponse } = await handleApiError(error);
    return { success: false, message, error: errorResponse };
  }
};
