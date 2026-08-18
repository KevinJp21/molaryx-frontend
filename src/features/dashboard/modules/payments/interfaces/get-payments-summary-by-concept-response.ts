import { TBaseResponse } from "@/types";

export interface IGetPaymentsSummaryByConceptResponse
  extends TBaseResponse<IGetPaymentsSummaryByConceptData> {}

export interface IGetPaymentsSummaryByConceptData {
  price: number | null;
  agreedPrice: number | null;
  totalPaid: number;
  remaining: number | null;
  paymentCount: number;
}
