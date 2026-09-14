"use client";

import { useState } from "react";
import { RouteGuard } from "../guards";
import { PlatformHeader, PlatformSidebar } from "../components";
import { SignalRProvider } from "@/features/notifications";

type Props = {
  children: React.ReactNode;
};

export const PlatformTemplate = ({ children }: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <RouteGuard>
      <SignalRProvider>
        <div className="relative flex h-dvh w-full overflow-hidden bg-ink-50">
          <PlatformSidebar isCollapsed={isSidebarCollapsed} />
          <div className="flex min-w-0 flex-1 flex-col bg-ink-50/40">
            <PlatformHeader
              isSidebarCollapsed={isSidebarCollapsed}
              onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            />
            <main className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-5 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </SignalRProvider>
    </RouteGuard>
  );
};

export * from "./platform-home-template";
