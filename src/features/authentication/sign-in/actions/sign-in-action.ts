"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostSignInFormRequest, IPostSignInResponse } from "../interfaces";
import { getObfuscatedCookieName } from "@/utils";
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/consts";
import { cookies, headers } from "next/headers";

export const apiPostSignInAction = async (
  data: IPostSignInFormRequest,
): Promise<IPostSignInResponse> => {
  const AUTH = process.env.AUTH;
  const SIGN_IN = process.env.SIGN_IN;

  const obfuscatedAuthTokenName = getObfuscatedCookieName(AUTH_TOKEN);
  const obfuscatedRefreshTokenName = getObfuscatedCookieName(REFRESH_TOKEN);
  const requestHeaders = await headers();

  try {
    const response = await serverApi.post<IPostSignInResponse>(
      `${AUTH}${SIGN_IN}`,
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

    if (response.data.data?.auth_token && response.data.data?.refresh_token) {
      (await cookies()).set(
        obfuscatedAuthTokenName,
        response.data.data.auth_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 15,
          path: "/",
        },
      );
      (await cookies()).set(
        obfuscatedRefreshTokenName,
        response.data.data.refresh_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        },
      );

      return { success: true, message: response.data.message };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    const { message, error: errorMessage } = await handleApiError(error, {
      redirectOn401: false,
    });
    return { success: false, message, error: errorMessage };
  }
};
