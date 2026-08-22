export type TMasterItem<TIdKey extends string> = {
  [K in TIdKey]: number;
} & {
  name: string | null;
  code: string | null;
};
