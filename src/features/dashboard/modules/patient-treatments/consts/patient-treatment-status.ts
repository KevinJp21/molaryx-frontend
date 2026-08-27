export const PATIENT_TREATMENT_STATUS = {
  ACTIVE: 1,
  PAUSED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const;

export type TTreatmentStatusId =
  (typeof PATIENT_TREATMENT_STATUS)[keyof typeof PATIENT_TREATMENT_STATUS];

export const isTreatmentStatusId = (
  id: number | null | undefined,
): id is TTreatmentStatusId =>
  id === PATIENT_TREATMENT_STATUS.ACTIVE ||
  id === PATIENT_TREATMENT_STATUS.PAUSED ||
  id === PATIENT_TREATMENT_STATUS.COMPLETED ||
  id === PATIENT_TREATMENT_STATUS.CANCELLED;

export const PATIENT_TREATMENT_STATUS_LABEL: Record<TTreatmentStatusId, string> = {
  [PATIENT_TREATMENT_STATUS.ACTIVE]: "Activo",
  [PATIENT_TREATMENT_STATUS.PAUSED]: "Pausado",
  [PATIENT_TREATMENT_STATUS.COMPLETED]: "Completado",
  [PATIENT_TREATMENT_STATUS.CANCELLED]: "Cancelado",
};

export const PATIENT_TREATMENT_STATUS_OPTION = (
  Object.values(PATIENT_TREATMENT_STATUS) as TTreatmentStatusId[]
).map((id) => ({
  value:id,
  name: PATIENT_TREATMENT_STATUS_LABEL[id],
}));

export const getTreatmentStatusLabel = (
  id: number | null | undefined,
  fallback?: string | null,
) => {
  if (fallback?.trim()) return fallback.trim();
  if (isTreatmentStatusId(id)) return PATIENT_TREATMENT_STATUS_LABEL[id];
  return "Sin estado";
};

export const PATIENT_TREATMENT_STATUS_FILTER_OPTIONS = (
  Object.values(PATIENT_TREATMENT_STATUS) as TTreatmentStatusId[]
).map((id) => ({
  value: id,
  name: PATIENT_TREATMENT_STATUS_LABEL[id],
}));

export type TPatientTreatmentStatusFilter = TTreatmentStatusId | "all";

export const PATIENT_TREATMENT_STATUS_COLORS: Record<
  TPatientTreatmentStatusFilter,
  string
> = {
  all: "var(--color-accent-500)",
  [PATIENT_TREATMENT_STATUS.ACTIVE]: "var(--color-accent-400)",
  [PATIENT_TREATMENT_STATUS.PAUSED]: "var(--color-chart-3)",
  [PATIENT_TREATMENT_STATUS.COMPLETED]: "var(--color-ink-600)",
  [PATIENT_TREATMENT_STATUS.CANCELLED]: "var(--color-coral-500)",
};

export const PATIENT_TREATMENT_STATUS_SIDEBAR_OPTIONS: {
  value: TPatientTreatmentStatusFilter;
  label: string;
  color: string;
}[] = [
  {
    value: "all",
    label: "Todos",
    color: PATIENT_TREATMENT_STATUS_COLORS.all,
  },
  {
    value: PATIENT_TREATMENT_STATUS.ACTIVE,
    label: PATIENT_TREATMENT_STATUS_LABEL[PATIENT_TREATMENT_STATUS.ACTIVE],
    color: PATIENT_TREATMENT_STATUS_COLORS[PATIENT_TREATMENT_STATUS.ACTIVE],
  },
  {
    value: PATIENT_TREATMENT_STATUS.PAUSED,
    label: PATIENT_TREATMENT_STATUS_LABEL[PATIENT_TREATMENT_STATUS.PAUSED],
    color: PATIENT_TREATMENT_STATUS_COLORS[PATIENT_TREATMENT_STATUS.PAUSED],
  },
  {
    value: PATIENT_TREATMENT_STATUS.COMPLETED,
    label: PATIENT_TREATMENT_STATUS_LABEL[PATIENT_TREATMENT_STATUS.COMPLETED],
    color: PATIENT_TREATMENT_STATUS_COLORS[PATIENT_TREATMENT_STATUS.COMPLETED],
  },
  {
    value: PATIENT_TREATMENT_STATUS.CANCELLED,
    label: PATIENT_TREATMENT_STATUS_LABEL[PATIENT_TREATMENT_STATUS.CANCELLED],
    color: PATIENT_TREATMENT_STATUS_COLORS[PATIENT_TREATMENT_STATUS.CANCELLED],
  },
];
