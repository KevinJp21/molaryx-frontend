"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  postLogout,
  resetPostLogout,
  selectGetUserData,
  selectPostLogout,
} from "@/store/authentication/authentication-slice";
import { resetGetNotifications } from "@/store/notifications/notifications-slice";
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components";
import { Notification } from "@/features/notifications";

type Props = {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

const LOGOUT_TOAST_ID = "platform-logout";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
};

export const PlatformHeader = ({
  isSidebarCollapsed,
  onToggleSidebar,
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: userData } = useAppSelector(selectGetUserData);
  const { status: logoutStatus } = useAppSelector(selectPostLogout);
  const firstName = userData?.names?.split(" ")[0];
  const fullName = userData
    ? `${userData.names} ${userData.surnames}`.trim()
    : undefined;
  const initials = `${userData?.names?.charAt(0) ?? ""}${userData?.surnames?.charAt(0) ?? ""}`;
  const roleName = userData?.role.name ?? "Super Admin";

  const handleLogout = async () => {
    toast.loading("Cerrando sesión...", { id: LOGOUT_TOAST_ID });

    const result = await dispatch(postLogout());
    dispatch(resetGetNotifications());

    if (postLogout.fulfilled.match(result) && result.payload.success) {
      toast.success("Sesión cerrada correctamente.", { id: LOGOUT_TOAST_ID });
      router.replace("/sign-in");
      return;
    }

    const description = postLogout.fulfilled.match(result)
      ? (result.payload.error ?? result.payload.message)
      : result.error?.message;

    toast.error("No fue posible cerrar sesión, intente nuevamente.", {
      id: LOGOUT_TOAST_ID,
      description,
    });
    dispatch(resetPostLogout());
  };

  return (
    <header className="flex h-15 shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          onClick={onToggleSidebar}
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-lg bg-ink-100 hover:bg-ink-200"
          aria-label={
            isSidebarCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"
          }
        >
          <Menu className="h-4 w-4" strokeWidth={1.75} />
        </Button>

        <div className="min-w-0">
          <p className="truncate text-[11px] text-ink-700">
            {getGreeting()}
            {firstName ? `, ${firstName}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Notification />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent-500/40"
              aria-label="Menú de cuenta"
              title={fullName}
            >
              <Avatar size="lg" className="cursor-pointer">
                <AvatarFallback className="bg-linear-to-br from-accent-400 to-coral-500 text-[11px] font-semibold text-ink-50">
                  {initials || "—"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60">
            <div className="px-2 py-2">
              <p className="truncate text-[13px] font-medium text-ink-900">
                {userData?.username ?? fullName ?? "Usuario"}
              </p>
              <p className="truncate text-xs text-ink-600">{roleName}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                className="gap-2.5 text-[13px]"
                disabled={logoutStatus === "loading"}
                onSelect={() => {
                  void handleLogout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
