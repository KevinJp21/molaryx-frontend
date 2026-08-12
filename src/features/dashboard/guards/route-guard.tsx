'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/store';
import { selectGetUserData } from '@/store/authentication/authentication-slice';
import { DASHBOARD_HOME_ROUTE, hasRouteAccess } from '../utils/route-permissions';

type Props = {
    children: React.ReactNode;
};

export const RouteGuard = ({ children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: userData, status } = useAppSelector(selectGetUserData);

    const isAllowed = hasRouteAccess(pathname, userData?.permissions);
    const isUserReady = status === 'success' && !!userData;

    useEffect(() => {
        if (isUserReady && !isAllowed) {
            router.replace(DASHBOARD_HOME_ROUTE);
        }
    }, [isUserReady, isAllowed, router]);

    if (isUserReady && !isAllowed) return null;

    return <>{children}</>;
};
