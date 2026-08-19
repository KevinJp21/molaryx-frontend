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
