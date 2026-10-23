import { IS_ACTIVE_STATUS } from "@/features/dashboard/consts";

export type TProcedureStatusFilter = boolean | "all";

const PROCEDURE_STATUS_COLOR_ACTIVE = "var(--color-accent-400)";
const PROCEDURE_STATUS_COLOR_INACTIVE = "var(--color-coral-500)";
const PROCEDURE_STATUS_COLOR_ALL = "var(--color-accent-500)";

export const getProcedureStatusColor = (status: TProcedureStatusFilter) => {
  if (status === "all") return PROCEDURE_STATUS_COLOR_ALL;
  return status ? PROCEDURE_STATUS_COLOR_ACTIVE : PROCEDURE_STATUS_COLOR_INACTIVE;
};

export const PROCEDURE_STATUS_FILTER_OPTIONS: {
  value: TProcedureStatusFilter;
  label: string;
  color: string;
}[] = [
  {
    value: "all",
    label: "Todos",
    color: PROCEDURE_STATUS_COLOR_ALL,
  },
  {
    value: true,
    label: IS_ACTIVE_STATUS.find((s) => s.value === true)?.name ?? "Activo",
    color: PROCEDURE_STATUS_COLOR_ACTIVE,
  },
  {
    value: false,
    label: IS_ACTIVE_STATUS.find((s) => s.value === false)?.name ?? "Inactivo",
    color: PROCEDURE_STATUS_COLOR_INACTIVE,
  },
];
