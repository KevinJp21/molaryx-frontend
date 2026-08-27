import {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_CHIP_CLASS,
  APPOINTMENT_STATUS_COLOR,
  type TAppointmentStatusId,
} from "@/features/dashboard/modules/appointments/consts/appointment-status";

export const TENANT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
  BLOCKED: 4,
  REJECTED: 5,
} as const;

export type TTenantStatus =
  (typeof TENANT_STATUS)[keyof typeof TENANT_STATUS];

const DEFAULT_STATUS_COLOR = "#7c4dff";
const DEFAULT_STATUS_CHIP_CLASS =
  "bg-accent-100 text-accent-700 ring-1 ring-inset ring-accent-200";

const TENANT_TO_APPOINTMENT_STATUS: Record<
  TTenantStatus,
  TAppointmentStatusId
> = {
  [TENANT_STATUS.ACTIVE]: APPOINTMENT_STATUS.CONFIRMED,
  [TENANT_STATUS.INACTIVE]: APPOINTMENT_STATUS.COMPLETED,
  [TENANT_STATUS.PENDING]: APPOINTMENT_STATUS.PENDING,
  [TENANT_STATUS.BLOCKED]: APPOINTMENT_STATUS.CANCELLED,
  [TENANT_STATUS.REJECTED]: APPOINTMENT_STATUS.NO_SHOW,
};

export const isTenantStatusId = (id: number): id is TTenantStatus =>
  id === TENANT_STATUS.ACTIVE ||
  id === TENANT_STATUS.INACTIVE ||
  id === TENANT_STATUS.PENDING ||
  id === TENANT_STATUS.BLOCKED ||
  id === TENANT_STATUS.REJECTED;

export const getTenantStatusColor = (id: number | null | undefined) => {
  if (!isTenantStatusId(Number(id))) return DEFAULT_STATUS_COLOR;
  return APPOINTMENT_STATUS_COLOR[TENANT_TO_APPOINTMENT_STATUS[id as TTenantStatus]];
};

export const getTenantStatusChipClass = (id: number | null | undefined) => {
  if (!isTenantStatusId(Number(id))) return DEFAULT_STATUS_CHIP_CLASS;
  return APPOINTMENT_STATUS_CHIP_CLASS[TENANT_TO_APPOINTMENT_STATUS[id as TTenantStatus]];
};
