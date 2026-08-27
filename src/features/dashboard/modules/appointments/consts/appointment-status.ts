export const APPOINTMENT_STATUS = {
  PENDING: 1,
  CONFIRMED: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  CANCELLED: 5,
  NO_SHOW: 6,
} as const;

export type TAppointmentStatusId =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export const APPOINTMENT_STATUS_LABEL: Record<TAppointmentStatusId, string> = {
  [APPOINTMENT_STATUS.PENDING]: "Pendiente",
  [APPOINTMENT_STATUS.CONFIRMED]: "Confirmada",
  [APPOINTMENT_STATUS.IN_PROGRESS]: "En curso",
  [APPOINTMENT_STATUS.COMPLETED]: "Completada",
  [APPOINTMENT_STATUS.CANCELLED]: "Cancelada",
  [APPOINTMENT_STATUS.NO_SHOW]: "No asistió",
};

export const APPOINTMENT_STATUS_COLOR: Record<TAppointmentStatusId, string> = {
  [APPOINTMENT_STATUS.PENDING]: "#FEE701",
  [APPOINTMENT_STATUS.CONFIRMED]: "#AEE802",
  [APPOINTMENT_STATUS.IN_PROGRESS]: "#5024bd",
  [APPOINTMENT_STATUS.COMPLETED]: "#3d1c93",
  [APPOINTMENT_STATUS.CANCELLED]: "#EB0000",
  [APPOINTMENT_STATUS.NO_SHOW]: "#dd2e77",
};

export const APPOINTMENT_STATUS_OPTIONS = (
  Object.values(APPOINTMENT_STATUS) as TAppointmentStatusId[]
).map((id) => ({
  id,
  label: APPOINTMENT_STATUS_LABEL[id],
  color: APPOINTMENT_STATUS_COLOR[id],
}));

const DEFAULT_STATUS_COLOR = "#7c4dff";

export const isAppointmentStatusId = (
  id: number | null | undefined,
): id is TAppointmentStatusId =>
  id === APPOINTMENT_STATUS.PENDING ||
  id === APPOINTMENT_STATUS.CONFIRMED ||
  id === APPOINTMENT_STATUS.IN_PROGRESS ||
  id === APPOINTMENT_STATUS.COMPLETED ||
  id === APPOINTMENT_STATUS.CANCELLED ||
  id === APPOINTMENT_STATUS.NO_SHOW;

export const getAppointmentStatusColor = (id: number | null | undefined) =>
  isAppointmentStatusId(id) ? APPOINTMENT_STATUS_COLOR[id] : DEFAULT_STATUS_COLOR;

export const APPOINTMENT_STATUS_CHIP_CLASS: Record<TAppointmentStatusId, string> = {
  [APPOINTMENT_STATUS.PENDING]:
    "bg-yellow-400/15 text-yellow-700 ring-1 ring-inset ring-yellow-400/30",
  [APPOINTMENT_STATUS.CONFIRMED]:
    "bg-lime-400/15 text-lime-700 ring-1 ring-inset ring-lime-400/30",
  [APPOINTMENT_STATUS.IN_PROGRESS]:
    "bg-accent-100 text-accent-700 ring-1 ring-inset ring-accent-200",
  [APPOINTMENT_STATUS.COMPLETED]:
    "bg-accent-200/60 text-accent-800 ring-1 ring-inset ring-accent-300",
  [APPOINTMENT_STATUS.CANCELLED]:
    "bg-red-500/10 text-red-600 ring-1 ring-inset ring-red-500/25",
  [APPOINTMENT_STATUS.NO_SHOW]:
    "bg-coral-500/10 text-coral-600 ring-1 ring-inset ring-coral-500/25",
};

const DEFAULT_STATUS_CHIP_CLASS =
  "bg-accent-100 text-accent-700 ring-1 ring-inset ring-accent-200";

export const getAppointmentStatusChipClass = (id: number | null | undefined) =>
  isAppointmentStatusId(id)
    ? APPOINTMENT_STATUS_CHIP_CLASS[id]
    : DEFAULT_STATUS_CHIP_CLASS;

export const getAppointmentStatusLabel = (
  id: number | null | undefined,
  fallback?: string | null,
) => {
  if (fallback?.trim()) return fallback.trim();
  if (isAppointmentStatusId(id)) return APPOINTMENT_STATUS_LABEL[id];
  return "Sin estado";
};
