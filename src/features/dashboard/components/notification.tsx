"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Bell, Loader2 } from "lucide-react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getNotifications,
  markAllNotificationsAsViewed,
  markNotificationAsViewed,
  prependNotification,
  selectGetNotifications,
} from "@/store/notifications/notifications-slice";
import { parseUtcDate } from "@/utils";
import {
  getNotificationTypeMeta
} from "../consts";
import { useSignalRContext } from "../hooks/signal-r-provider";
import type { INotificationItems } from "../interfaces";
import { cn } from "@/lib/utils";

const CLIENT_NEW_NOTIFICATION = "client_new_notification";

const formatNotificationTime = (value: string) => {
  try {
    return formatDistanceToNow(parseUtcDate(value), {
      addSuffix: true,
      locale: es,
    });
  } catch {
    return value;
  }
};

export const Notification = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isConnected, on, off, invoke } = useSignalRContext();
  const { status, data, message } = useAppSelector(selectGetNotifications);
  const [open, setOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const items = data?.items ?? [];
  const currentPage = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 0;
  const hasMore = currentPage < totalPages;
  const unreadCount = items.filter((item) => !item.isViewed).length;
  const isInitialLoading = status === "loading" && items.length === 0;

  useEffect(() => {
    if (!isConnected) return;

    const handleNewNotification = (...args: unknown[]) => {
      // Payload = NotificationRealtimePayload (camelCase JSON)
      dispatch(prependNotification(args[0] as INotificationItems));
    };

    on(CLIENT_NEW_NOTIFICATION, handleNewNotification);

    return () => {
      off(CLIENT_NEW_NOTIFICATION, handleNewNotification);
    };
  }, [dispatch, isConnected, off, on]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      await dispatch(
        getNotifications({
          Page: currentPage + 1}),
      );
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, dispatch, hasMore, loadingMore]);

  const handleMarkAllAsViewed = useCallback(async () => {
    if (unreadCount === 0 || markingAll) return;
    setMarkingAll(true);
    try {
      await invoke("mark_all_as_viewed");
      dispatch(markAllNotificationsAsViewed());
    } catch (error) {
      console.error("[SignalR] mark_all_as_viewed", error);
    } finally {
      setMarkingAll(false);
    }
  }, [dispatch, invoke, markingAll, unreadCount]);

  const handleNotificationClick = useCallback(
    async (notification: INotificationItems) => {
      const meta = getNotificationTypeMeta(notification.type);

      if (!notification.isViewed) {
        try {
          await invoke("mark_as_viewed", notification.idNotification);
          dispatch(markNotificationAsViewed(notification.idNotification));
        } catch (error) {
          console.error("[SignalR] mark_as_viewed", error);
        }
      }

      setOpen(false);
      router.push(meta.href);
    },
    [dispatch, invoke, router],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 hover:bg-ink-800"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 right-0 px-2 h-5 min-w-5 rounded-full bg-accent-500 text-xs text-white flex items-center justify-center" >
                {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="flex w-[min(100vw-1.5rem,22rem)] flex-col gap-0 overflow-hidden p-0"
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink-800 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-50">Notificaciones</p>
            <p className="mt-0.5 text-xs text-ink-400">
              {unreadCount > 0
                ? `${unreadCount} sin leer`
                : "Estás al día"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 shrink-0 px-2 text-xs text-accent-300 hover:bg-accent-500/10 hover:text-accent-200"
              disabled={markingAll || !isConnected}
              onClick={() => {
                void handleMarkAllAsViewed();
              }}
            >
              {markingAll ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Marcando...
                </>
              ) : (
                "Marcar todas"
              )}
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isInitialLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-ink-400">
              <Spinner className="size-4" />
              Cargando...
            </div>
          ) : status === "error" && items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-400">
              {message ?? "No se pudieron cargar las notificaciones."}
            </p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Bell className="size-5 text-ink-500" strokeWidth={1.5} />
              <p className="text-sm text-ink-400">No tienes notificaciones</p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {items.map((notification) => {
                const meta = getNotificationTypeMeta(notification.type);
                const Icon = meta.icon;

                return (
                  <li key={notification.idNotification}>
                    <button
                      type="button"
                      onClick={() => {
                        void handleNotificationClick(notification);
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 border-b border-ink-800/80 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-ink-900/70",
                        !notification.isViewed && "bg-accent-500/5",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                          notification.isViewed
                            ? "bg-ink-900 text-ink-400"
                            : "bg-accent-500/15 text-accent-300",
                        )}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span
                            className={cn(
                              "truncate text-[13px]",
                              notification.isViewed
                                ? "font-medium text-ink-200"
                                : "font-semibold text-ink-50",
                            )}
                          >
                            {notification.subject}
                          </span>
                          {!notification.isViewed && (
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-500 animate-pulse" />
                          )}
                        </span>
                        <span className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-400">
                          {notification.body}
                        </span>
                        <span className="mt-1.5 block text-[11px] text-ink-500">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {hasMore && (
          <div className="border-t border-ink-800 p-2">
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-full rounded-lg text-xs text-ink-300 hover:bg-ink-900 hover:text-ink-50"
              disabled={loadingMore || status === "loading"}
              onClick={() => {
                void handleLoadMore();
              }}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Mostrar más"
              )}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
