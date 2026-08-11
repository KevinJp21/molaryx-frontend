import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_TOKEN,
  REFRESH_TOKEN,
  PUBLIC_AUTH_ROUTES,
  PROTECTED_ROUTE_PREFIXES,
} from "./consts";
import { getObfuscatedCookieName } from "./utils";
import {
  applySessionCookies,
  clearSessionCookies,
  refreshSessionFromProxy,
} from "./lib/auth/refresh-session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authCookie = getObfuscatedCookieName(AUTH_TOKEN);
  const refreshCookie = getObfuscatedCookieName(REFRESH_TOKEN);

  const token = req.cookies.get(authCookie)?.value;
  const refreshToken = req.cookies.get(refreshCookie)?.value;

  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !token) {
    if (refreshToken) {
      const tokens = await refreshSessionFromProxy(refreshToken);

      if (tokens) {
        const response = NextResponse.next({
          request: { headers: req.headers },
        });
        applySessionCookies(response, tokens);
        return response;
      }

      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("session", "expired");
      const response = NextResponse.redirect(url);
      clearSessionCookies(response);
      return response;
    }

    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("session", "unauthenticated");
    return NextResponse.redirect(url);
  }

  if (isPublicAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
