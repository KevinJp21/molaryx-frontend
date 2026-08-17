import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/consts";
import { getObfuscatedCookieName } from "@/utils";
import type { TBaseResponse } from "@/types";

type TSessionTokens = {
  auth_token: string;
  refresh_token: string;
};

const COOKIE_PATH = "/";
const REFRESH_TIMEOUT_MS = 10_000;

const authCookieName = () => getObfuscatedCookieName(AUTH_TOKEN);
const refreshCookieName = () => getObfuscatedCookieName(REFRESH_TOKEN);

const refreshInFlight = new Map<string, Promise<TSessionTokens | null>>();

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: COOKIE_PATH,
  maxAge: 60 * 15,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: COOKIE_PATH,
  maxAge: 60 * 60 * 24 * 7,
};

export function applySessionCookies(
  response: NextResponse,
  tokens: TSessionTokens,
) {
  response.cookies.set(authCookieName(), tokens.auth_token, authCookieOptions);
  response.cookies.set(
    refreshCookieName(),
    tokens.refresh_token,
    refreshCookieOptions,
  );
}

/** Sigue la request con los tokens nuevos visibles para Server Actions y RSC. */
export function continueWithSession(req: NextRequest, tokens: TSessionTokens) {
  req.cookies.set(authCookieName(), tokens.auth_token);
  req.cookies.set(refreshCookieName(), tokens.refresh_token);

  const response = NextResponse.next({
    request: { headers: req.headers },
  });
  applySessionCookies(response, tokens);
  return response;
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.delete({ name: authCookieName(), path: COOKIE_PATH });
  response.cookies.delete({ name: refreshCookieName(), path: COOKIE_PATH });
}

export async function refreshSessionFromProxy(
  refreshToken: string,
  requestHeaders: Headers,
): Promise<TSessionTokens | null> {
  const existing = refreshInFlight.get(refreshToken);
  if (existing) return existing;

  const pending = refreshSessionRequest(refreshToken, requestHeaders).finally(
    () => {
      refreshInFlight.delete(refreshToken);
    },
  );
  refreshInFlight.set(refreshToken, pending);
  return pending;
}

async function refreshSessionRequest(
  refreshToken: string,
  requestHeaders: Headers,
): Promise<TSessionTokens | null> {
  const URL = process.env.URL;
  const URN = process.env.URN;
  const AUTH = process.env.AUTH;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  const baseUrl = `${URL}${URN}`;
  const endpoint = `${AUTH}${REFRESH_TOKEN}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": requestHeaders.get("user-agent") ?? "unknown",
        "X-Forwarded-For":
          requestHeaders.get("x-forwarded-for") ??
          requestHeaders.get("x-real-ip") ??
          "",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const body = (await response.json()) as TBaseResponse<TSessionTokens>;
    const tokens = body.data;

    if (!tokens?.auth_token || !tokens?.refresh_token) return null;

    return tokens;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
