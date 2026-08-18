export const PAYMENT_METHOD = {
  CASH: 1,
  CARD: 2,
  TRANSFER: 3,
  OTHER: 4,
} as const;

export type TPaymentMethodId =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_METHOD_LABEL: Record<TPaymentMethodId, string> = {
  [PAYMENT_METHOD.CASH]: "Efectivo",
  [PAYMENT_METHOD.CARD]: "Tarjeta",
  [PAYMENT_METHOD.TRANSFER]: "Transferencia",
  [PAYMENT_METHOD.OTHER]: "Otro",
};

export const PAYMENT_METHOD_OPTIONS = (
  [
    PAYMENT_METHOD.CASH,
    PAYMENT_METHOD.CARD,
    PAYMENT_METHOD.TRANSFER,
    PAYMENT_METHOD.OTHER,
  ] as TPaymentMethodId[]
).map((id) => ({
  value: id,
  name: PAYMENT_METHOD_LABEL[id],
}));

export const getPaymentMethodLabel = (id: number, fallback?: string | null) =>
  PAYMENT_METHOD_LABEL[id as TPaymentMethodId] ?? fallback ?? "—";
