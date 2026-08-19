export const TREATMENT_STATUS = {
  ACTIVE: 1,
  PAUSED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const;

export type TTreatmentStatusId =
  (typeof TREATMENT_STATUS)[keyof typeof TREATMENT_STATUS];

export const TREATMENT_STATUS_LABEL: Record<TTreatmentStatusId, string> = {
  [TREATMENT_STATUS.ACTIVE]: "Activo",
  [TREATMENT_STATUS.PAUSED]: "Pausado",
  [TREATMENT_STATUS.COMPLETED]: "Completado",
  [TREATMENT_STATUS.CANCELLED]: "Cancelado",
};

export const TREATMENT_STATUS_TRANSITIONS: Record<
  TTreatmentStatusId,
  TTreatmentStatusId[]
> = {
  [TREATMENT_STATUS.ACTIVE]: [
    TREATMENT_STATUS.ACTIVE,
    TREATMENT_STATUS.PAUSED,
    TREATMENT_STATUS.COMPLETED,
    TREATMENT_STATUS.CANCELLED,
  ],
  [TREATMENT_STATUS.PAUSED]: [
    TREATMENT_STATUS.PAUSED,
    TREATMENT_STATUS.ACTIVE,
    TREATMENT_STATUS.CANCELLED,
  ],
  [TREATMENT_STATUS.COMPLETED]: [TREATMENT_STATUS.COMPLETED],
  [TREATMENT_STATUS.CANCELLED]: [TREATMENT_STATUS.CANCELLED],
};

export const isTreatmentStatusId = (
  id: number | null | undefined,
): id is TTreatmentStatusId =>
  id === TREATMENT_STATUS.ACTIVE ||
  id === TREATMENT_STATUS.PAUSED ||
  id === TREATMENT_STATUS.COMPLETED ||
  id === TREATMENT_STATUS.CANCELLED;

export const isFinalTreatmentStatus = (id: number | null | undefined) =>
  id === TREATMENT_STATUS.COMPLETED || id === TREATMENT_STATUS.CANCELLED;

export const getTreatmentStatusLabel = (
  id: number | null | undefined,
  fallback?: string | null,
) => {
  if (fallback?.trim()) return fallback.trim();
  if (isTreatmentStatusId(id)) return TREATMENT_STATUS_LABEL[id];
  return "Sin estado";
};

export const getAllowedTreatmentStatuses = (from: number) => {
  if (!isTreatmentStatusId(from)) return [];
  return TREATMENT_STATUS_TRANSITIONS[from];
};

export const TREATMENT_STATUS_FILTER_OPTIONS = (
  Object.values(TREATMENT_STATUS) as TTreatmentStatusId[]
).map((id) => ({
  value: id,
  name: TREATMENT_STATUS_LABEL[id],
}));
