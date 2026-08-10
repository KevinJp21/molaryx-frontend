import { BaseResponse } from "@/types";
import { TMasterItem } from "./master-item";

export interface IBaseMasterListResponse<TIdKey extends string> extends BaseResponse<TMasterItem<TIdKey>[]> {}