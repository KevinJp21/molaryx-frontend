'use client';

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getUserData,
  logout,
  selectGetUserData,
  selectPostLogout,
} from "@/store/authentication/authentication-slice";
import { PUBLIC_AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES } from "@/consts";
import Image from "next/image";

const SessionExpiredHandler = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const session = searchParams.get("session") === "expired";
  const unauthenticated = searchParams.get("session") === "unauthenticated";

  useEffect(() => {
    if (!session && !unauthenticated) return;

    dispatch(logout());

    if (session) {
      toast.error(
        "Su sesión ha expirado, por favor, inicie sesión nuevamente para continuar.",
      );
    }

    router.replace("/sign-in");
  }, [session, unauthenticated, dispatch, router]);

  return null;
};

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { status, userState } = useAppSelector(selectGetUserData);
  const { status: logoutStatus } = useAppSelector(selectPostLogout);
  const pathname = usePathname();
  const router = useRouter();
  const isIntentionalLogout =
    logoutStatus === "loading" || logoutStatus === "success";

  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );

  useEffect(() => {
    if (status !== "idle") return;
    dispatch(getUserData());
  }, [dispatch, status]);

  useEffect(() => {
    if (status === "loading" || status === "idle") return;

    if (isProtectedRoute && userState === "unauthenticated") {
      // Logout deliberado: no marcar sesión como "unauthenticated" en la URL.
      router.replace(isIntentionalLogout ? "/sign-in" : "/sign-in?session=unauthenticated");
      return;
    }

    if (userState === "authenticated" && isPublicAuthRoute) {
      router.replace("/dashboard");
    }
  }, [
    pathname,
    router,
    status,
    userState,
    isProtectedRoute,
    isPublicAuthRoute,
    isIntentionalLogout,
  ]);

  // En dashboard no pintes la app hasta haber sesión. Si getUser falla por
  // carrera del refresh, RouteGuard se quedaba en el logo con status error.
  if (isProtectedRoute && userState !== "authenticated") {
    return (
      <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center bg-background">
        <Image
          src="/images/molaryx_logo_animated.svg"
          alt="Cargando Molaryx"
          width={248}
          height={248}
          priority
          className="size-62"
        />
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <SessionExpiredHandler />
      </Suspense>
      {children}
    </>
  );
};
