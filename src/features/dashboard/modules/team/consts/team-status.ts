import { USER_STATUS } from "@/features/dashboard/consts";

export type TUserStatusId = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type TTeamStatusFilter = TUserStatusId | "all";

const STATUS_COLOR_ALL = "var(--color-accent-500)";
const STATUS_COLOR_ACTIVE = "var(--color-accent-400)";
const STATUS_COLOR_INACTIVE = "var(--color-coral-500)";
const STATUS_COLOR_PENDING = "var(--color-ink-600)";
const STATUS_COLOR_BLOCKED = "var(--color-coral-600)";

export const getTeamStatusColor = (status: TTeamStatusFilter) => {
  if (status === "all") return STATUS_COLOR_ALL;
  if (status === USER_STATUS.ACTIVE) return STATUS_COLOR_ACTIVE;
  if (status === USER_STATUS.INACTIVE) return STATUS_COLOR_INACTIVE;
  if (status === USER_STATUS.PENDING) return STATUS_COLOR_PENDING;
  return STATUS_COLOR_BLOCKED;
};

export const TEAM_STATUS_FILTER_OPTIONS: {
  value: TTeamStatusFilter;
  label: string;
  color: string;
}[] = [
  { value: "all", label: "Todos", color: STATUS_COLOR_ALL },
  { value: USER_STATUS.ACTIVE, label: "Activo", color: STATUS_COLOR_ACTIVE },
  { value: USER_STATUS.INACTIVE, label: "Inactivo", color: STATUS_COLOR_INACTIVE },
  { value: USER_STATUS.PENDING, label: "Pendiente", color: STATUS_COLOR_PENDING },
  { value: USER_STATUS.BLOCKED, label: "Bloqueado", color: STATUS_COLOR_BLOCKED },
];

export const getTeamStatusBadgeVariant = (
  idUserStatus: number,
): "success" | "destructive" | "muted" | "secondary" => {
  if (idUserStatus === USER_STATUS.ACTIVE) return "success";
  if (idUserStatus === USER_STATUS.INACTIVE) return "destructive";
  if (idUserStatus === USER_STATUS.PENDING) return "muted";
  return "secondary";
};
