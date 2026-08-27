"use server";

import { cookies } from "next/headers";
import { AUTH_TOKEN } from "@/consts";
import { getObfuscatedCookieName } from "@/utils";

export type TNotificationHubConnection = {
  success: boolean;
  hubUrl?: string;
  accessToken?: string;
  message?: string;
};

export const apiGetNotificationHubConnectionAction =
  async (): Promise<TNotificationHubConnection> => {
    const URL = process.env.URL;
    const URN = process.env.URN;
    const WEB_SOCKET_NOTIFICATION = process.env.WEB_SOCKET_NOTIFICATION;

    const obfuscatedCookieName = getObfuscatedCookieName(AUTH_TOKEN);
    const accessToken =
      (await cookies()).get(obfuscatedCookieName)?.value ?? null;

    if (!accessToken) {
      return {
        success: false,
        message: "No hay una sesión activa para conectar al hub.",
      };
    }

    return {
      success: true,
      hubUrl: `${URL}${URN}${WEB_SOCKET_NOTIFICATION}`,
      accessToken,
    };
  };
