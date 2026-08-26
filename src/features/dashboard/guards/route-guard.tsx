'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectGetUserData } from '@/store/authentication/authentication-slice';
import {
  getNotifications,
  selectGetNotifications,
} from '@/store/notifications/notifications-slice';
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
  const dispatch = useAppDispatch();
  const { data: userData, status } = useAppSelector(selectGetUserData);
  const { status: notificationsStatus } = useAppSelector(selectGetNotifications);

  const isUserReady = status === 'success' && !!userData;
  const isAllowed =
    isUserReady && hasRouteAccess(pathname, userData.permissions);

  useEffect(() => {
    if (!isUserReady || !userData) return;
    if (hasRouteAccess(pathname, userData.permissions)) return;
    router.replace(DASHBOARD_HOME_ROUTE);
  }, [isUserReady, pathname, userData, router]);

  useEffect(() => {
    if (!isUserReady) return;
    if (notificationsStatus !== 'idle') return;
    dispatch(getNotifications());
  }, [dispatch, isUserReady, notificationsStatus]);

  // No renderizar la ruta hasta confirmar permisos (AuthGuard cubre error de sesión).
  if (!isUserReady || !isAllowed) {
    return <RouteLoading />;
  }

  return <>{children}</>;
};
