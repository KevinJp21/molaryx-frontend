import { TBaseResponse } from "@/types";
import { TMasterItem } from "./master-item";

export interface IBaseMasterListResponse<TIdKey extends string> extends TBaseResponse<TMasterItem<TIdKey>[]> {}