'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, Logo } from '@/components';
import { Skeleton } from '@/components/ui/skeleton';
import { selectGetUserData } from '@/store/authentication/authentication-slice';
import { useAppSelector } from '@/store';
import { ROLES } from '@/consts';
import { filterSectionItemsByPermissions } from '../utils/route-permissions';

type Props = {
  isCollapsed: boolean;
};

export const DashboardSidebar = ({ isCollapsed }: Props) => {
  const pathname = usePathname();
  const { data: userData, status: userStatus } = useAppSelector(selectGetUserData);

  const visibleSections = filterSectionItemsByPermissions(userData?.permissions);

  const roleName =
    ROLES.find((role) => role.id === Number(userData?.role.idUserRole))?.name ??
    userData?.role.name;

  const initials = `${userData?.names?.charAt(0) ?? ''}${userData?.surnames?.charAt(0) ?? ''}`;
  const displayName = [userData?.names?.split(' ')[0], userData?.surnames?.split(' ')[0]]
    .filter(Boolean)
    .join(' ');

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-white/6 bg-ink-900/60 p-3 transition-all duration-200 ${
        isCollapsed ? 'w-21' : 'w-56'
      }`}
    >

      <div
        className={`mb-3 flex items-center px-2 py-1.5 ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <Logo
          size={isCollapsed ? 30 : 30}
          showWordmark={!isCollapsed}
          layout="fixed"
        />
      </div>

      {/* Navigation */}
      <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {visibleSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <p className="px-2.5 text-[11px] font-medium tracking-[0.04em] text-ink-400 uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex w-full items-center rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                    isCollapsed ? 'justify-center' : 'gap-2.5'
                  } ${
                    isActive
                      ? 'bg-accent-500/10 text-accent-300 ring-1 ring-inset ring-accent-500/20'
                      : 'text-ink-300 hover:bg-accent-500/10 hover:text-accent-300 hover:ring-1 hover:ring-inset hover:ring-accent-500/20'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        className={`mt-auto rounded-xl border border-white/6 bg-ink-850 p-3 ${
          isCollapsed ? 'flex justify-center' : ''
        }`}
      >
        {userStatus === 'loading' || userStatus === 'idle' ? (
          <div className={`flex items-center ${isCollapsed ? '' : 'gap-2.5'}`}>
            <Skeleton className="size-8 shrink-0 rounded-full bg-ink-700" />
            {!isCollapsed && (
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3 w-3/4 rounded bg-ink-700" />
                <Skeleton className="h-2.5 w-1/2 rounded bg-ink-700" />
              </div>
            )}
          </div>
        ) : (
          <div className={`flex items-center ${isCollapsed ? '' : 'gap-2.5'}`}>
            <Avatar size="default">
              <AvatarFallback className="bg-linear-to-br from-accent-400 to-coral-500 text-[11px] font-semibold text-ink-950">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-[11px] font-medium text-ink-100">
                  {displayName || userData?.username}
                </p>
                <p className="truncate text-[10px] text-ink-300">{roleName}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
