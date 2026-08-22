'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/store';
import { selectGetUserData } from '@/store/authentication/authentication-slice';
import { DASHBOARD_HOME_ROUTE, hasRouteAccess } from '../utils/route-permissions';

type Props = {
  children: React.ReactNode;
};

const RouteLoading = () => (
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

export const RouteGuard = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userData, status } = useAppSelector(selectGetUserData);

  const isUserReady = status === 'success' && !!userData;
  const isAllowed =
    isUserReady && hasRouteAccess(pathname, userData.permissions);

  useEffect(() => {
    if (!isUserReady || !userData) return;
    if (hasRouteAccess(pathname, userData.permissions)) return;
    router.replace(DASHBOARD_HOME_ROUTE);
  }, [isUserReady, pathname, userData, router]);

  if (status === 'error') return null;

  // No renderizar la ruta hasta confirmar permisos
  if (!isUserReady || !isAllowed) {
    return <RouteLoading />;
  }

  return <>{children}</>;
};
