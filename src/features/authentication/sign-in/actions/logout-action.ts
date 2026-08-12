"use server";

import { cookies } from "next/headers";
import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/consts";
import { TBaseResponse } from "@/types";
import { getObfuscatedCookieName } from "@/utils";

const COOKIE_PATH = "/";

export const clearSessionCookieAction = async (): Promise<void> => {
  const cookieStore = await cookies();
  const obfuscatedAuthTokenName = getObfuscatedCookieName(AUTH_TOKEN);
  const obfuscatedRefreshTokenName = getObfuscatedCookieName(REFRESH_TOKEN);

  cookieStore.delete({ name: obfuscatedAuthTokenName, path: COOKIE_PATH });
  cookieStore.delete({ name: obfuscatedRefreshTokenName, path: COOKIE_PATH });
};

export const apiLogoutAction = async (): Promise<TBaseResponse<void>> => {
  const AUTH = process.env.AUTH;
  const LOGOUT = process.env.LOGOUT;
  const obfuscatedRefreshTokenName = getObfuscatedCookieName(REFRESH_TOKEN);
  const refreshToken = (await cookies()).get(obfuscatedRefreshTokenName)?.value;

  try {
    const response = await serverApi.post<TBaseResponse<void>>(
      `${AUTH}${LOGOUT}`,
      { refreshToken },
      { withScope: false },
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const { message } = await handleApiError(error);

    return {
      success: false,
      message
    };
  } finally {
    await clearSessionCookieAction();
  }
};
