'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CreditCard, LogOut, Menu, Settings, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    postLogout,
    resetPostLogout,
    selectGetUserData,
    selectPostLogout,
} from '@/store/authentication/authentication-slice';
import { ROLES } from '@/consts';
import {
    Avatar,
    AvatarFallback,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components';

type Props = {
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
};

export const DashboardHeader = ({
    isSidebarCollapsed,
    onToggleSidebar,
}: Props) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: userData } = useAppSelector(selectGetUserData);
    const { status: logoutStatus, message: logoutMessage, error: logoutError } =
        useAppSelector(selectPostLogout);
    const firstName = userData?.names?.split(' ')[0];
    const fullName = userData ? `${userData.names} ${userData.surnames}`.trim() : undefined;
    const initials = `${userData?.names?.charAt(0) ?? ''}${userData?.surnames?.charAt(0) ?? ''}`;
    const roleName =
        ROLES.find((role) => role.id === Number(userData?.role.idUserRole))?.name ??
        userData?.role.name;

    const greeting = getGreeting();

    useEffect(() => {
        if (logoutStatus === 'loading') {
            toast.loading('Cerrando sesión...');
            return;
        }

        if (logoutStatus === 'error') {
            toast.dismiss();
            toast.error('No fue posible cerrar sesión, intente nuevamente.', {
                description: logoutError,
            });
        }

        if (logoutStatus === 'success') {
            toast.dismiss();
            toast.success('Sesión cerrada correctamente.');
            router.replace('/sign-in');
        }

        dispatch(resetPostLogout());
    }, [logoutStatus, logoutMessage, logoutError, dispatch, router]);

    return (
        <header className="flex h-15 shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-5">
            <div className="flex min-w-0 items-center gap-3">
                <Button
                    type="button"
                    onClick={onToggleSidebar}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-lg bg-ink-900 hover:bg-ink-800"
                    aria-label={
                        isSidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'
                    }
                >
                    <Menu className="h-4 w-4" strokeWidth={1.75} />
                </Button>

                <div className="min-w-0">
                    <p className="truncate text-[11px] text-ink-300">
                        {greeting}
                        {firstName ? `, ${firstName}` : ''}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 hover:bg-ink-800"
                    aria-label="Notificaciones"
                >
                    <Bell className="h-4 w-4" strokeWidth={1.75} />
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent-500" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent-500/40"
                            aria-label="Menú de cuenta"
                            title={fullName}
                        >
                            <Avatar size="lg" className="cursor-pointer">
                                <AvatarFallback className="bg-linear-to-br from-accent-400 to-coral-500 text-[11px] font-semibold text-ink-950">
                                    {initials || '—'}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuItem
                            className="h-auto items-start justify-between gap-2.5 py-2 text-[13px] text-ink-300 focus:bg-accent-500/10 focus:text-accent-300 focus:ring-1 focus:ring-inset focus:ring-accent-500/20"
                            onSelect={() => router.push('/dashboard/account/settings')}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-current">
                                    {userData?.username ?? fullName ?? 'Usuario'}
                                </p>
                                <p className="truncate text-xs text-ink-400 group-focus/dropdown-menu-item:text-accent-300/70">
                                    {roleName ?? 'Sin rol'}
                                </p>
                            </div>
                            <Settings className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="gap-2.5 text-[13px] text-ink-300 focus:bg-accent-500/10 focus:text-accent-300 focus:ring-1 focus:ring-inset focus:ring-accent-500/20"
                                onSelect={() => router.push('/dashboard/account/profile')}
                            >
                                <User className="h-4 w-4" />
                                Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2.5 text-[13px] text-ink-300 focus:bg-accent-500/10 focus:text-accent-300 focus:ring-1 focus:ring-inset focus:ring-accent-500/20"
                                onSelect={() => router.push('/dashboard/account/billing')}
                            >
                                <CreditCard className="h-4 w-4" />
                                Facturación
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2.5 text-[13px] text-ink-300 focus:bg-accent-500/10 focus:text-accent-300 focus:ring-1 focus:ring-inset focus:ring-accent-500/20"
                                onSelect={() => router.push('/dashboard/account/settings')}
                            >
                                <Settings className="h-4 w-4" />
                                Configuración
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                variant="destructive"
                                className="gap-2.5 text-[13px]"
                                disabled={logoutStatus === 'loading'}
                                onSelect={() => {
                                    dispatch(postLogout());
                                }}
                            >
                                <LogOut className="h-4 w-4" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
