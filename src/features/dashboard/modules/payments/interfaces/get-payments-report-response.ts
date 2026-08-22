import { TBaseResponse } from "@/types";

export interface IGetPaymentsReportResponse extends TBaseResponse<Blob> {
  filename?: string;
}
