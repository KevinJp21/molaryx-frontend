"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { useAppSelector } from "@/store";
import { filterSectionItemsByPermissions } from "../utils/route-permissions";

type Props = {
  isCollapsed: boolean;
};

export const PlatformSidebar = ({ isCollapsed }: Props) => {
  const pathname = usePathname();
  const { data: userData, status: userStatus } = useAppSelector(selectGetUserData);

  const visibleSections = filterSectionItemsByPermissions(userData?.permissions);
  const roleName = userData?.role.name ?? "Super Admin";

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-white/6 bg-ink-900/60 p-3 transition-all duration-200 ${
        isCollapsed ? "w-21" : "w-56"
      }`}
    >
      <div
        className={`mb-3 flex items-center px-2 py-1.5 ${
          isCollapsed ? "justify-center" : ""
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
                    isCollapsed ? "justify-center" : "gap-2.5"
                  } ${
                    isActive
                      ? "bg-accent-500/10 text-accent-300 ring-1 ring-inset ring-accent-500/20"
                      : "text-ink-300 hover:bg-accent-500/10 hover:text-accent-300 hover:ring-1 hover:ring-inset hover:ring-accent-500/20"
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
        className="mt-auto rounded-xl border border-white/6 bg-ink-850 p-3"
        title={isCollapsed ? roleName : undefined}
      >
        {userStatus === "loading" || userStatus === "idle" ? (
          isCollapsed ? (
            <Skeleton className="mx-auto size-8 rounded-full bg-ink-700" />
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-3 w-2/3 rounded bg-ink-700" />
              <Skeleton className="h-2.5 w-1/2 rounded bg-ink-700" />
            </div>
          )
        ) : isCollapsed ? (
          <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-accent-500/15 text-[10px] font-semibold text-accent-300">
            SA
          </div>
        ) : (
          <>
            <p className="text-[11px] font-medium text-ink-100">Plataforma Molaryx</p>
            <p className="mt-0.5 text-[10px] text-ink-300">{roleName}</p>
          </>
        )}
      </div>
    </aside>
  );
};
