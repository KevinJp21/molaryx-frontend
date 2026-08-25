import { TBaseResponse } from "@/types";
import { TPaginationResponse } from "@/types";


export interface IGetNotificationsResponse extends TBaseResponse<IGetNotificationsResponseData> {}

export interface IGetNotificationsResponseData extends TPaginationResponse<INotificationItems> {}

export interface INotificationItems {
  idNotification: number;
  type: string;
  subject: string;
  body: string;
  isViewed: boolean;
  createdAt: string;
}