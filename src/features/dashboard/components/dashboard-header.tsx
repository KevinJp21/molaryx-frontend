'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Bell, LogOut, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { apiLogoutAction } from '@/features/authentication';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout, selectGetUserData } from '@/store/authentication/authentication-slice';
import { Button } from '@/components';

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
    const pathname = usePathname();
    const firstName = userData?.names?.split(' ')[0];
    const initials = `${userData?.names?.charAt(0) ?? ''}${userData?.surnames?.charAt(0) ?? ''}`;

    const greeting = getGreeting();

    /*
    Obtener sección actual
    const getCurrentSection = () => {
        const sections: Array<{ matcher: string; label: string }> = [
            { matcher: '/dashboard', label: 'Inicio' },
            { matcher: '/dashboard/patients', label: 'Pacientes' },
        ];

        const match = sections.find((section) => pathname === section.matcher);
        return match?.label ?? 'Inicio';
    };
    */
    const handleLogout = async () => {
        try {
            await apiLogoutAction();
            dispatch(logout());
            toast.success('Sesión cerrada correctamente.');
            router.replace('/sign-in');
        } catch {
            toast.error('No fue posible cerrar sesión, intente nuevamente.');
        }
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

                <span
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-accent-400 to-coral-500 text-[11px] font-semibold text-ink-950"
                    title={userData ? `${userData.names} ${userData.surnames}` : undefined}
                >
                    {initials || '—'}
                </span>

                <Button
                    type="button"
                    onClick={handleLogout}
                    variant="ghost"
                    className="rounded-lg bg-ink-900 hover:bg-ink-800"
                    aria-label="Cerrar sesión"
                >
                    <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                    <span className="hidden text-xs sm:inline">Salir</span>
                </Button>
            </div>
        </header>
    );
};
