'use client';

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { getUserData, logout, selectGetUserData } from "@/store/authentication/authentication-slice";
import { Spinner } from "@/components/ui";
import { PUBLIC_AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES } from "@/consts";

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
  const pathname = usePathname();
  const router = useRouter();

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
      router.replace("/sign-in?session=unauthenticated");
      return;
    }

    if (userState === "authenticated" && isPublicAuthRoute) {
      router.replace("/dashboard");
    }
  }, [pathname, router, status, userState, isProtectedRoute, isPublicAuthRoute]);

  const isCheckingSession = status === "idle" || status === "loading";

  // Spinner en rutas protegidas mientras valida sesión con el API
  if (isCheckingSession && isProtectedRoute) {
    return (
      <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center gap-3 bg-background">
        <Spinner className="size-10 text-accent-500" />
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
