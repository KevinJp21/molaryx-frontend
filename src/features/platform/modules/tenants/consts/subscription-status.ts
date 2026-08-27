export const TENANT_SUBSCRIPTION_STATUS = {
  PENDING: 1,
  ACTIVE: 2,
  SCHEDULED: 3,
  CANCELLED: 4,
  EXPIRED: 5,
  SUSPENDED: 6,
} as const;

export type TTenantSubscriptionStatusId =
  (typeof TENANT_SUBSCRIPTION_STATUS)[keyof typeof TENANT_SUBSCRIPTION_STATUS];

export const isTenantSubscriptionStatusId = (
  id: number | null | undefined,
): id is TTenantSubscriptionStatusId =>
  id === TENANT_SUBSCRIPTION_STATUS.PENDING ||
  id === TENANT_SUBSCRIPTION_STATUS.ACTIVE ||
  id === TENANT_SUBSCRIPTION_STATUS.SCHEDULED ||
  id === TENANT_SUBSCRIPTION_STATUS.CANCELLED ||
  id === TENANT_SUBSCRIPTION_STATUS.EXPIRED ||
  id === TENANT_SUBSCRIPTION_STATUS.SUSPENDED;

export const TENANT_SUBSCRIPTION_STATUS_LABEL: Record<
  TTenantSubscriptionStatusId,
  string
> = {
  [TENANT_SUBSCRIPTION_STATUS.PENDING]: "Pendiente",
  [TENANT_SUBSCRIPTION_STATUS.ACTIVE]: "Activa",
  [TENANT_SUBSCRIPTION_STATUS.SCHEDULED]: "Programada",
  [TENANT_SUBSCRIPTION_STATUS.CANCELLED]: "Cancelada",
  [TENANT_SUBSCRIPTION_STATUS.EXPIRED]: "Expirada",
  [TENANT_SUBSCRIPTION_STATUS.SUSPENDED]: "Suspendida",
};

export const TENANT_SUBSCRIPTION_STATUS_COLORS: Record<
  TTenantSubscriptionStatusId,
  string
> = {
  [TENANT_SUBSCRIPTION_STATUS.PENDING]: "var(--color-chart-3)",
  [TENANT_SUBSCRIPTION_STATUS.ACTIVE]: "var(--color-accent-400)",
  [TENANT_SUBSCRIPTION_STATUS.SCHEDULED]: "var(--color-accent-500)",
  [TENANT_SUBSCRIPTION_STATUS.CANCELLED]: "var(--color-coral-500)",
  [TENANT_SUBSCRIPTION_STATUS.EXPIRED]: "var(--color-ink-600)",
  [TENANT_SUBSCRIPTION_STATUS.SUSPENDED]: "var(--color-coral-600)",
};

const DEFAULT_STATUS_COLOR = "var(--color-accent-500)";
const DEFAULT_STATUS_CHIP_CLASS =
  "bg-accent-100 text-accent-700 ring-1 ring-inset ring-accent-200";

export const getTenantSubscriptionStatusColor = (
  id: number | null | undefined,
) =>
  isTenantSubscriptionStatusId(id)
    ? TENANT_SUBSCRIPTION_STATUS_COLORS[id]
    : DEFAULT_STATUS_COLOR;

export const TENANT_SUBSCRIPTION_STATUS_CHIP_CLASS: Record<
  TTenantSubscriptionStatusId,
  string
> = {
  [TENANT_SUBSCRIPTION_STATUS.PENDING]:
    "bg-chart-3/15 text-chart-3 ring-1 ring-inset ring-chart-3/30",
  [TENANT_SUBSCRIPTION_STATUS.ACTIVE]:
    "bg-accent-500/12 text-accent-600 ring-1 ring-inset ring-accent-500/25",
  [TENANT_SUBSCRIPTION_STATUS.SCHEDULED]:
    "bg-accent-100 text-accent-700 ring-1 ring-inset ring-accent-200",
  [TENANT_SUBSCRIPTION_STATUS.CANCELLED]:
    "bg-coral-500/12 text-coral-600 ring-1 ring-inset ring-coral-500/25",
  [TENANT_SUBSCRIPTION_STATUS.EXPIRED]:
    "bg-ink-200 text-ink-700 ring-1 ring-inset ring-ink-300",
  [TENANT_SUBSCRIPTION_STATUS.SUSPENDED]:
    "bg-coral-600/12 text-coral-700 ring-1 ring-inset ring-coral-600/25",
};

export const getTenantSubscriptionStatusChipClass = (
  id: number | null | undefined,
) =>
  isTenantSubscriptionStatusId(id)
    ? TENANT_SUBSCRIPTION_STATUS_CHIP_CLASS[id]
    : DEFAULT_STATUS_CHIP_CLASS;

export const TENANT_SUBSCRIPTION_STATUS_OPTION = (
  Object.values(TENANT_SUBSCRIPTION_STATUS) as TTenantSubscriptionStatusId[]
).map((id) => ({
  value: id,
  name: TENANT_SUBSCRIPTION_STATUS_LABEL[id],
}));

/** Alias legado por si algún import usaba el nombre anterior. */
export type TTenantSubscriptionStatus = TTenantSubscriptionStatusId;
