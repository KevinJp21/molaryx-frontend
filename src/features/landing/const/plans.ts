import type { IPlanUiMeta } from "../interfaces";

/** Solo metadatos de UI que no vienen de la API. */
export const PLAN_UI_META: Record<number, IPlanUiMeta> = {
  1: {
    featured: false,
    ctaLabel: "Comenzar con Basic",
  },
  2: {
    featured: true,
    ctaLabel: "Comenzar con Professional",
  },
  3: {
    featured: false,
    ctaLabel: "Contáctenos",
  },
};

export const PLAN_INCLUDED_FEATURES = [
  "Agenda",
  "Gestión de citas",
  "Gestión de pacientes",
  "Gestión de servicios",
  "Pagos y abonos",
  "Administración del consultorio",
] as const;
