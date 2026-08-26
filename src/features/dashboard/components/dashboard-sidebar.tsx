'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { differenceInCalendarDays } from 'date-fns';
import { Logo } from '@/components';
import { Skeleton } from '@/components/ui/skeleton';
import { selectGetUserData } from '@/store/authentication/authentication-slice';
import { useAppSelector } from '@/store';
import { formatDate, toColombiaDate } from '@/utils';
import { ACCOUNT_BASE_PATH } from '../modules/account';
import { filterSectionItemsByPermissions } from '../utils/route-permissions';

type Props = {
  isCollapsed: boolean;
};

const getExpirationLabel = (
  endsAt: string | null | undefined,
  daysRemaining: number | null | undefined,
) => {
  if (daysRemaining == null || !endsAt) {
    return 'Sin vencimiento';
  }

  if (daysRemaining < 0) {
    return 'Suscripción expirada';
  }

  if (daysRemaining === 0) {
    return 'Vence hoy';
  }

  if (daysRemaining === 1) {
    return 'Vence mañana';
  }

  return `Vence el ${formatDate(endsAt, 'd MMM yyyy')}`;
};

const getSubscriptionProgressPct = (
  startsAt: string | null | undefined,
  endsAt: string | null | undefined,
  daysRemaining: number | null | undefined,
) => {
  if (!startsAt || !endsAt || daysRemaining == null || daysRemaining < 0) {
    return 0;
  }

  const startDate = toColombiaDate(startsAt);
  const endDate = toColombiaDate(endsAt);
  const totalDays = Math.max(1, differenceInCalendarDays(endDate, startDate));

  return Math.min(100, Math.max(0, (daysRemaining / totalDays) * 100));
};

export const DashboardSidebar = ({ isCollapsed }: Props) => {
  const pathname = usePathname();
  const { data: userData, status: userStatus } = useAppSelector(selectGetUserData);

  const visibleSections = filterSectionItemsByPermissions(userData?.permissions);

  const subscription = userData?.subscription;
  const planName = subscription?.planName ?? 'Plan';
  const expirationLabel = getExpirationLabel(
    subscription?.endsAt,
    subscription?.daysRemaining,
  );
  const progressPct = getSubscriptionProgressPct(
    subscription?.startsAt,
    subscription?.endsAt,
    subscription?.daysRemaining,
  );

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

      <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {visibleSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && section.items.length > 1 && (
              <p className="px-2.5 text-[11px] font-medium tracking-[0.04em] text-ink-400 uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

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

      <Link
        href={`${ACCOUNT_BASE_PATH}/billing`}
        title={isCollapsed ? `${planName} · ${expirationLabel}` : undefined}
        className="mt-auto block rounded-xl border border-white/6 bg-ink-850 p-3 transition-colors hover:border-white/10 hover:bg-ink-800/80"
      >
        {userStatus === 'loading' || userStatus === 'idle' ? (
          isCollapsed ? (
            <Skeleton className="h-1.5 w-full rounded-full bg-ink-700" />
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-3 w-2/3 rounded bg-ink-700" />
              <Skeleton className="h-2.5 w-1/2 rounded bg-ink-700" />
              <Skeleton className="mt-1 h-1.5 w-full rounded-full bg-ink-700" />
            </div>
          )
        ) : isCollapsed ? (
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700"
            aria-hidden
          >
            <div
              className="h-full rounded-full bg-accent-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        ) : (
          <>
            <p className="text-[11px] font-medium text-ink-100">{planName}</p>
            <p className="mt-0.5 text-[10px] text-ink-300">{expirationLabel}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
              <div
                className="h-full rounded-full bg-accent-500 transition-[width]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </>
        )}
      </Link>
    </aside>
  );
};
