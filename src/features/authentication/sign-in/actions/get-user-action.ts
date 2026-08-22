"use server";

import { cookies, headers } from "next/headers";
import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { ApiError } from "@/lib/api/types";
import {
  authCookieName,
  authCookieOptions,
  refreshCookieName,
  refreshCookieOptions,
  refreshSessionFromProxy,
} from "@/lib/auth/refresh-session";
import { IGetUserResponse } from "../interfaces/get-user-response";

const userEndpoint = () => `${process.env.AUTH}${process.env.GET_USER}`;

const fetchUser = async (accessToken?: string) => {
  const response = await serverApi.get<IGetUserResponse>(
    userEndpoint(),
    accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  );

  return {
    success: true as const,
    message: response.data.message,
    data: response.data.data,
  };
};

const persistRefreshedSession = async (
  tokens: { auth_token: string; refresh_token: string },
) => {
  const cookieStore = await cookies();
  cookieStore.set(authCookieName(), tokens.auth_token, authCookieOptions);
  cookieStore.set(
    refreshCookieName(),
    tokens.refresh_token,
    refreshCookieOptions,
  );
};

const refreshAccessToken = async () => {
  const cookieStore = await cookies();
  const currentRefreshToken = cookieStore.get(refreshCookieName())?.value;
  if (!currentRefreshToken) return null;

  const tokens = await refreshSessionFromProxy(
    currentRefreshToken,
    await headers(),
  );
  if (!tokens) return null;

  await persistRefreshedSession(tokens);
  return tokens.auth_token;
};

export const apiGetUserAction = async (): Promise<IGetUserResponse> => {
  try {
    return await fetchUser();
  } catch (error) {
    const isUnauthorized = error instanceof ApiError && error.status === 401;

    if (isUnauthorized) {
      const accessToken = await refreshAccessToken();
      if (accessToken) {
        try {
          return await fetchUser(accessToken);
        } catch (retryError) {
          const { message } = await handleApiError(retryError, {
            redirectOn401: false,
          });
          return { success: false, message };
        }
      }
    }

    const { message } = await handleApiError(error, { redirectOn401: false });
    return { success: false, message };
  }
};
