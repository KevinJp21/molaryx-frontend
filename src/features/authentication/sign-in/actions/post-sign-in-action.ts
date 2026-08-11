"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { IPostSignInFormRequest, IPostSignInResponse } from "../interfaces";
import { getObfuscatedCookieName } from "@/utils";
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/consts";
import { cookies } from "next/headers";

export const apiPostSignIn = async (
  data: IPostSignInFormRequest,
): Promise<IPostSignInResponse> => {
  const AUTH = process.env.AUTH;
  const POST_SIGN_IN = process.env.POST_SIGN_IN;

  const obfuscatedAuthTokenName = getObfuscatedCookieName(AUTH_TOKEN);
  const obfuscatedRefreshTokenName = getObfuscatedCookieName(REFRESH_TOKEN);

  try {
    const response = await serverApi.post<IPostSignInResponse>(
      `${AUTH}${POST_SIGN_IN}`,
      data,
    );

    if (response.data.data?.auth_token && response.data.data?.refresh_token) {
      (await cookies()).set(
        obfuscatedAuthTokenName,
        response.data.data.auth_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
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
    const { message, error: errorMessage } = await handleApiError(error, { redirectOn401: false });
    return { success: false, message, error: errorMessage };
  }
};
