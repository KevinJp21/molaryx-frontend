'use client';

import { useState } from 'react';
import { RouteGuard } from '../guards';
import { DashboardHeader, DashboardSidebar } from '../components';

type Props = {
  children: React.ReactNode;
};

export const DashboardTemplate = ({ children }: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <RouteGuard>
      <div className="relative flex h-dvh w-full overflow-hidden bg-ink-950">
        <DashboardSidebar isCollapsed={isSidebarCollapsed} />
        <div className="flex min-w-0 flex-1 flex-col bg-ink-950/40">
          <DashboardHeader
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
};
