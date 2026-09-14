import { USER_STATUS } from "@/features/dashboard/consts";

export type TUserStatusId = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_LABEL: Record<TUserStatusId, string> = {
  [USER_STATUS.ACTIVE]: "Activo",
  [USER_STATUS.INACTIVE]: "Inactivo",
  [USER_STATUS.PENDING]: "Pendiente",
  [USER_STATUS.BLOCKED]: "Bloqueado",
};

export const USER_STATUS_OPTION = (
  Object.values(USER_STATUS) as TUserStatusId[]
).map((id) => ({
  value: id,
  name: USER_STATUS_LABEL[id],
}));

export const getUserStatusLabel = (
  id: number | null | undefined,
  fallback?: string | null,
) => {
  if (fallback?.trim()) return fallback.trim();
  if (
    id === USER_STATUS.ACTIVE ||
    id === USER_STATUS.INACTIVE ||
    id === USER_STATUS.PENDING ||
    id === USER_STATUS.BLOCKED
  ) {
    return USER_STATUS_LABEL[id];
  }
  return "Sin estado";
};

export const getUserStatusBadgeVariant = (
  idUserStatus: number,
): "success" | "destructive" | "muted" | "secondary" => {
  if (idUserStatus === USER_STATUS.ACTIVE) return "success";
  if (idUserStatus === USER_STATUS.INACTIVE) return "destructive";
  if (idUserStatus === USER_STATUS.PENDING) return "muted";
  return "secondary";
};

export { USER_STATUS };
