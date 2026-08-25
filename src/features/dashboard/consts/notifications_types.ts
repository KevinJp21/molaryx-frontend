import type { LucideIcon } from "lucide-react";
import { Bell, CalendarCheck2, CalendarClock } from "lucide-react";

export type TNotificationTypeMeta = {
  id: number;
  href: string;
  icon: LucideIcon;
  label: string;
};

/**
 * Clave = `Type` que envía el backend (nameof enum).
 * Varios tipos pueden compartir la misma vista (`href`); el icono es por tipo.
 */
export const NOTIFICATIONS_TYPES = {
  APPOINTMENT_ASSIGNED: {
    id: 1,
    href: "/dashboard/appointments",
    icon: CalendarCheck2,
    label: "Cita asignada",
  },
  APPOINTMENT_REMINDER: {
    id: 2,
    href: "/dashboard/appointments",
    icon: CalendarClock,
    label: "Recordatorio",
  },
} as const satisfies Record<string, TNotificationTypeMeta>;

export type TNotificationTypeKey = keyof typeof NOTIFICATIONS_TYPES;

const FALLBACK_NOTIFICATION_TYPE: TNotificationTypeMeta = {
  id: 0,
  href: "/dashboard",
  icon: Bell,
  label: "Notificación",
};

export const getNotificationTypeMeta = (
  type: string,
): TNotificationTypeMeta =>
  NOTIFICATIONS_TYPES[type as TNotificationTypeKey] ??
  FALLBACK_NOTIFICATION_TYPE;
