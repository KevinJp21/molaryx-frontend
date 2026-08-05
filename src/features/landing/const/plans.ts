import type { IPlan, IPlanUiMeta } from "../interfaces";

export const PLANS: IPlan[] = [
  {
    idPlan: 1,
    name: "Basic",
    price: 79900,
    maxProfessionals: 1,
    maxAssistants: 1,
    maxPatients: 500
  },
  {
    idPlan: 2,
    name: "Professional",
    price: 119900,
    maxProfessionals: 3,
    maxAssistants: 3,
    maxPatients: 2000,
    promotion: {
      idPromotion: 1,
      price: 89900,
    },
  },
];

export const PLAN_UI_META: Record<number, IPlanUiMeta> = {
  1: {
    description: "Ideal para consultorios odontológicos pequeños que quieren ordenar su operación.",
    featured: false,
    ctaLabel: "Comenzar con Basic",
  },
  2: {
    description: "Para consultorios odontológicos en crecimiento que necesitan más capacidad.",
    featured: true,
    ctaLabel: "Comenzar con Professional",
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
