import { IS_ACTIVE_STATUS } from "@/features/dashboard/consts";

export type TPatientStatusFilter = boolean | "all";

const PATIENT_STATUS_COLOR_ACTIVE = "var(--color-accent-400)";
const PATIENT_STATUS_COLOR_INACTIVE = "var(--color-coral-500)";
const PATIENT_STATUS_COLOR_ALL = "var(--color-accent-500)";

export const getPatientStatusColor = (status: TPatientStatusFilter) => {
  if (status === "all") return PATIENT_STATUS_COLOR_ALL;
  return status ? PATIENT_STATUS_COLOR_ACTIVE : PATIENT_STATUS_COLOR_INACTIVE;
};

export const PATIENT_STATUS_FILTER_OPTIONS: {
  value: TPatientStatusFilter;
  label: string;
  color: string;
}[] = [
  {
    value: "all",
    label: "Todos",
    color: PATIENT_STATUS_COLOR_ALL,
  },
  {
    value: true,
    label: IS_ACTIVE_STATUS.find((s) => s.value === true)?.name ?? "Activo",
    color: PATIENT_STATUS_COLOR_ACTIVE,
  },
  {
    value: false,
    label: IS_ACTIVE_STATUS.find((s) => s.value === false)?.name ?? "Inactivo",
    color: PATIENT_STATUS_COLOR_INACTIVE,
  },
];
