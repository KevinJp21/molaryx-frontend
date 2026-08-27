export const TENANT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
  BLOCKED: 4,
  REJECTED: 5,
} as const;

export type TTenantStatusId =
  (typeof TENANT_STATUS)[keyof typeof TENANT_STATUS];

export const isTenantStatusId = (
  id: number | null | undefined,
): id is TTenantStatusId =>
  id === TENANT_STATUS.ACTIVE ||
  id === TENANT_STATUS.INACTIVE ||
  id === TENANT_STATUS.PENDING ||
  id === TENANT_STATUS.BLOCKED ||
  id === TENANT_STATUS.REJECTED;

export const TENANT_STATUS_LABEL: Record<TTenantStatusId, string> = {
  [TENANT_STATUS.ACTIVE]: "Activo",
  [TENANT_STATUS.INACTIVE]: "Inactivo",
  [TENANT_STATUS.PENDING]: "Pendiente",
  [TENANT_STATUS.BLOCKED]: "Bloqueado",
  [TENANT_STATUS.REJECTED]: "Rechazado",
};

export const TENANT_STATUS_OPTION = (
  Object.values(TENANT_STATUS) as TTenantStatusId[]
).map((id) => ({
  value: id,
  name: TENANT_STATUS_LABEL[id],
}));

export const getTenantStatusLabel = (
  id: number | null | undefined,
  fallback?: string | null,
) => {
  if (fallback?.trim()) return fallback.trim();
  if (isTenantStatusId(id)) return TENANT_STATUS_LABEL[id];
  return "Sin estado";
};

export type TTenantStatusFilter = TTenantStatusId | "all";

export const TENANT_STATUS_COLORS: Record<TTenantStatusFilter, string> = {
  all: "var(--color-accent-500)",
  [TENANT_STATUS.ACTIVE]: "var(--color-accent-400)",
  [TENANT_STATUS.INACTIVE]: "var(--color-ink-600)",
  [TENANT_STATUS.PENDING]: "#FEE701",
  [TENANT_STATUS.BLOCKED]: "var(--color-coral-500)",
  [TENANT_STATUS.REJECTED]: "var(--color-coral-600)",
};

const DEFAULT_STATUS_COLOR = "var(--color-accent-500)";

export const getTenantStatusColor = (id: number | null | undefined) =>
  isTenantStatusId(id) ? TENANT_STATUS_COLORS[id] : DEFAULT_STATUS_COLOR;

export const TENANT_STATUS_CHIP_CLASS: Record<TTenantStatusId, string> = {
  [TENANT_STATUS.ACTIVE]:
    "bg-accent-500/12 text-accent-600 ring-1 ring-inset ring-accent-500/25",
  [TENANT_STATUS.INACTIVE]:
    "bg-ink-200 text-ink-700 ring-1 ring-inset ring-ink-300",
  [TENANT_STATUS.PENDING]:
    "bg-yellow-400/12 text-yellow-400 ring-1 ring-inset ring-yellow-400/30",
  [TENANT_STATUS.BLOCKED]:
    "bg-coral-500/12 text-coral-600 ring-1 ring-inset ring-coral-500/25",
  [TENANT_STATUS.REJECTED]:
    "bg-coral-600/12 text-coral-600 ring-1 ring-inset ring-coral-600/25",
};

const DEFAULT_STATUS_CHIP_CLASS =
  "bg-accent-100 text-accent-700 ring-1 ring-inset ring-accent-200";

export const getTenantStatusChipClass = (id: number | null | undefined) =>
  isTenantStatusId(id)
    ? TENANT_STATUS_CHIP_CLASS[id]
    : DEFAULT_STATUS_CHIP_CLASS;

export const TENANT_STATUS_FILTER_OPTIONS: {
  value: TTenantStatusFilter;
  label: string;
  color: string;
}[] = [
  {
    value: "all",
    label: "Todos",
    color: TENANT_STATUS_COLORS.all,
  },
  ...(Object.values(TENANT_STATUS) as TTenantStatusId[]).map((id) => ({
    value: id,
    label: TENANT_STATUS_LABEL[id],
    color: TENANT_STATUS_COLORS[id],
  })),
];
