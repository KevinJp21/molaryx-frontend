"use client";

import { AccountSidebar } from "../components";

type Props = {
  children: React.ReactNode;
};

export const AccountLayoutTemplate = ({ children }: Props) => {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-ink-50 md:flex-row">
      <AccountSidebar />
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};
