import type { IPlan } from "../interfaces";
import { PLAN_INCLUDED_FEATURES } from "../const/plans";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const formatPlanPrice = (value: number) => currency.format(value);

export const getPromotionDiscount = (price: number, promotionPrice: number) =>
  Math.round((1 - promotionPrice / price) * 100);

const formatSeat = (value: number, singular: string, plural: string) => {
  if (value === 1) return `1 ${singular}`;
  return `Hasta ${value.toLocaleString("es-CO")} ${plural}`;
};

export const getPlanFeatureList = (plan: IPlan): string[] => [
  formatSeat(plan.maxProfessionals, "profesional", "profesionales"),
  formatSeat(plan.maxAssistants, "asistente", "asistentes"),
  `Hasta ${plan.maxPatients.toLocaleString("es-CO")} pacientes`,
  ...PLAN_INCLUDED_FEATURES,
];
