import {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_CHIP_CLASS,
  APPOINTMENT_STATUS_COLOR,
  type TAppointmentStatusId,
} from "@/features/dashboard/modules/appointments/consts/appointment-status";

export const TENANT_SUBSCRIPTION_STATUS = {
  PENDING: 1,
  ACTIVE: 2,
  SCHEDULED: 3,
  CANCELLED: 4,
  EXPIRED: 5,
  SUSPENDED: 6,
} as const;

export type TTenantSubscriptionStatus =
  (typeof TENANT_SUBSCRIPTION_STATUS)[keyof typeof TENANT_SUBSCRIPTION_STATUS];

const DEFAULT_STATUS_COLOR = "#7c4dff";
const DEFAULT_STATUS_CHIP_CLASS =
  "bg-accent-100 text-accent-700 ring-1 ring-inset ring-accent-200";

const SUBSCRIPTION_TO_APPOINTMENT_STATUS: Record<
  TTenantSubscriptionStatus,
  TAppointmentStatusId
> = {
  [TENANT_SUBSCRIPTION_STATUS.PENDING]: APPOINTMENT_STATUS.PENDING,
  [TENANT_SUBSCRIPTION_STATUS.ACTIVE]: APPOINTMENT_STATUS.CONFIRMED,
  [TENANT_SUBSCRIPTION_STATUS.SCHEDULED]: APPOINTMENT_STATUS.IN_PROGRESS,
  [TENANT_SUBSCRIPTION_STATUS.CANCELLED]: APPOINTMENT_STATUS.CANCELLED,
  [TENANT_SUBSCRIPTION_STATUS.EXPIRED]: APPOINTMENT_STATUS.COMPLETED,
  [TENANT_SUBSCRIPTION_STATUS.SUSPENDED]: APPOINTMENT_STATUS.NO_SHOW,
};

export const isTenantSubscriptionStatusId = (
  id: number,
): id is TTenantSubscriptionStatus =>
  id === TENANT_SUBSCRIPTION_STATUS.PENDING ||
  id === TENANT_SUBSCRIPTION_STATUS.ACTIVE ||
  id === TENANT_SUBSCRIPTION_STATUS.SCHEDULED ||
  id === TENANT_SUBSCRIPTION_STATUS.CANCELLED ||
  id === TENANT_SUBSCRIPTION_STATUS.EXPIRED ||
  id === TENANT_SUBSCRIPTION_STATUS.SUSPENDED;

export const getTenantSubscriptionStatusColor = (
  id: number | null | undefined,
) => {
  if (!isTenantSubscriptionStatusId(Number(id))) return DEFAULT_STATUS_COLOR;
  return APPOINTMENT_STATUS_COLOR[
    SUBSCRIPTION_TO_APPOINTMENT_STATUS[id as TTenantSubscriptionStatus]
  ];
};

export const getTenantSubscriptionStatusChipClass = (
  id: number | null | undefined,
) => {
  if (!isTenantSubscriptionStatusId(Number(id))) return DEFAULT_STATUS_CHIP_CLASS;
  return APPOINTMENT_STATUS_CHIP_CLASS[
    SUBSCRIPTION_TO_APPOINTMENT_STATUS[id as TTenantSubscriptionStatus]
  ];
};
