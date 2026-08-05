import { BaseResponse } from "@/types";
import { TMasterItem } from "./master-item";

export type TMasterListResponse<TIdKey extends string> = BaseResponse<TMasterItem<TIdKey>[]>;