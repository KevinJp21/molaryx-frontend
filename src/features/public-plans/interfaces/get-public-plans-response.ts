import { TBaseResponse } from "@/types";

export interface IGetPublicPlansResponse extends TBaseResponse<IGetPublicPlans[]> {}

export interface IGetPublicPlans {
  idPlan: number;
  name: string;
  description: string;
  price: number | null;
  maxProfessionals: number | null;
  maxAssistants: number | null;
  maxPatients: number | null;
  promotionPlan: IPromotionPlan | null;
}

export interface IPromotionPlan {
  idPromotion: number;
  promotionName: string;
  price: number;
}
