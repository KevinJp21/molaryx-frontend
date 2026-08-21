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
import {
    Avatar,
    AvatarFallback,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
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

    const handleComingSoon = (section: string) => {
        toast.info(`${section} estará disponible pronto.`);
    };

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
                            <Avatar size="lg" className='cursor-pointer'>
                                <AvatarFallback className="bg-linear-to-br from-accent-400 to-coral-500 text-[11px] font-semibold text-ink-950">
                                    {initials || '—'}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleComingSoon('Perfil')}>
                                <User />
                                Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleComingSoon('Facturación')}>
                                <CreditCard />
                                Facturación
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleComingSoon('Configuración')}>
                                <Settings />
                                Configuración
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                variant="destructive"
                                disabled={logoutStatus === 'loading'}
                                onSelect={() => {
                                    dispatch(postLogout());
                                }}
                            >
                                <LogOut />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
