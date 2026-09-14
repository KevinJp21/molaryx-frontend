import { differenceInCalendarDays } from "date-fns";
import { formatDate, toColombiaDate } from "@/utils";

export type SubscriptionDisplayStatus = "active" | "expiring" | "expired" | "unknown";

export const getSubscriptionDisplayStatus = (
  daysRemaining: number | null | undefined,
  statusName?: string | null,
): SubscriptionDisplayStatus => {
  const normalizedStatus = statusName?.toLowerCase() ?? "";

  if (
    normalizedStatus.includes("expir") ||
    (daysRemaining != null && daysRemaining < 0)
  ) {
    return "expired";
  }

  if (daysRemaining != null && daysRemaining <= 7) {
    return "expiring";
  }

  if (normalizedStatus.includes("activ")) {
    return "active";
  }

  if (daysRemaining != null && daysRemaining >= 0) {
    return "active";
  }

  return "unknown";
};

export const getSubscriptionExpirationLabel = (
  endsAt: string | null | undefined,
  daysRemaining: number | null | undefined,
) => {
  if (daysRemaining == null || !endsAt) {
    return "Sin fecha de vencimiento";
  }

  if (daysRemaining < 0) {
    return "Suscripción expirada";
  }

  if (daysRemaining === 0) {
    return "Vence hoy";
  }

  if (daysRemaining === 1) {
    return "Vence mañana";
  }

  return `Vence el ${formatDate(endsAt, "d MMMM yyyy")}`;
};

export const getSubscriptionProgressPct = (
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

export const getSubscriptionDaysLabel = (
  daysRemaining: number | null | undefined,
) => {
  if (daysRemaining == null) {
    return "—";
  }

  if (daysRemaining < 0) {
    return `${Math.abs(daysRemaining)} día${Math.abs(daysRemaining) === 1 ? "" : "s"} vencido${Math.abs(daysRemaining) === 1 ? "" : "s"}`;
  }

  if (daysRemaining === 0) {
    return "Último día";
  }

  return `${daysRemaining} día${daysRemaining === 1 ? "" : "s"} restante${daysRemaining === 1 ? "" : "s"}`;
};
