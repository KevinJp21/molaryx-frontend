import { BaseResponse } from "@/types";

export interface IGetPublicPlansResponse extends BaseResponse<IGetPublicPlans[]> {}

export interface IGetPublicPlans {
  idPlan: number;
  name: string;
  description: string;
  price: number;
  maxProfessionals: number;
  maxAssistants: number;
  maxPatients: number;
  promotionPlans: IPromotionPlan;
}

export interface IPromotionPlan {
  idPromotion: number;
  promotionName: string;
  price: number;
}
