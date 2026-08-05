export interface IPlanPromotion {
  idPromotion: number;
  price: number;
}

export interface IPlan {
  idPlan: number;
  name: string;
  price: number;
  maxProfessionals: number;
  maxAssistants: number;
  maxPatients: number;
  promotion?: IPlanPromotion;
}

export interface IPlanUiMeta {
  description: string;
  featured: boolean;
  ctaLabel: string;
}
