"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCOUNT_NAV_ITEMS } from "../consts";

const navLinkClass = (isActive: boolean) =>
  cn(
    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
    isActive
      ? "bg-accent-500/10 text-accent-300 ring-1 ring-inset ring-accent-500/20"
      : "text-ink-300 hover:bg-accent-500/10 hover:text-accent-300 hover:ring-1 hover:ring-inset hover:ring-accent-500/20",
  );

export const AccountSidebar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: barra superior */}
      <div className="flex shrink-0 flex-col gap-3 border-b border-white/6 bg-ink-900/60 px-3 py-3 md:hidden">
        <Link
          href="/dashboard"
          className={navLinkClass(false)}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>Volver</span>
        </Link>
        <nav className="flex gap-1 overflow-x-auto" aria-label="Cuenta">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(navLinkClass(isActive), "w-auto shrink-0")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop: sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-white/6 bg-ink-900/60 p-3 md:flex">
        <Link href="/dashboard" className={cn(navLinkClass(false), "mb-4")}>
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>Volver</span>
        </Link>

        <nav className="flex flex-col space-y-1" aria-label="Cuenta">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(isActive)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
