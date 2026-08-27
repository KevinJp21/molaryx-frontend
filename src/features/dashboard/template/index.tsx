'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { RouteGuard } from '../guards';
import { DashboardHeader, DashboardSidebar } from '../components';
import { SignalRProvider } from '@/features/notifications';
import { ACCOUNT_BASE_PATH } from '../modules/account';

type Props = {
  children: React.ReactNode;
};

export const DashboardTemplate = ({ children }: Props) => {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isAccountRoute = pathname.startsWith(ACCOUNT_BASE_PATH);

  return (
    <RouteGuard>
      {isAccountRoute ? (
        children
      ) : (
        <SignalRProvider>
          <div className="relative flex h-dvh w-full overflow-hidden bg-ink-50">
            <DashboardSidebar isCollapsed={isSidebarCollapsed} />
            <div className="flex min-w-0 flex-1 flex-col bg-ink-50/40">
              <DashboardHeader
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
              />
              <main className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-5 md:p-6">
                {children}
              </main>
            </div>
          </div>
        </SignalRProvider>
      )}
    </RouteGuard>
  );
};
