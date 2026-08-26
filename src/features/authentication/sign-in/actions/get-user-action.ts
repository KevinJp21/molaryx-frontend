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

/** Resultado de getUser: `unauthorized` solo cuando la sesión no es válida (401). */
export type TGetUserActionResult = IGetUserResponse & {
  unauthorized?: boolean;
};

const userEndpoint = () => `${process.env.AUTH}${process.env.GET_USER}`;

const fetchUser = async (accessToken?: string): Promise<TGetUserActionResult> => {
  const response = await serverApi.get<IGetUserResponse>(
    userEndpoint(),
    accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  );

  return {
    success: true,
    message: response.data.message,
    data: response.data.data,
  };
};

const persistRefreshedSession = async (tokens: {
  auth_token: string;
  refresh_token: string;
}) => {
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

const fail = async (
  error: unknown,
  unauthorized = false,
): Promise<TGetUserActionResult> => {
  const { message } = await handleApiError(error, { redirectOn401: false });
  return { success: false, message, unauthorized };
};

export const apiGetUserAction = async (): Promise<TGetUserActionResult> => {
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
          const stillUnauthorized =
            retryError instanceof ApiError && retryError.status === 401;
          return fail(retryError, stillUnauthorized);
        }
      }

      return fail(error, true);
    }

    return fail(error, false);
  }
};
