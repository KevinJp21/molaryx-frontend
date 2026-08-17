export const PAYMENT_FREQUENCY = {
  NONE: 0,
  ONE_TIME: 1,
  WEEKLY: 2,
  BIWEEKLY: 3,
  MONTHLY: 4,
} as const;

export type TPaymentFrequencyId =
  (typeof PAYMENT_FREQUENCY)[keyof typeof PAYMENT_FREQUENCY];

export const PAYMENT_FREQUENCY_LABEL: Record<TPaymentFrequencyId, string> = {
  [PAYMENT_FREQUENCY.NONE]: "Sin frecuencia",
  [PAYMENT_FREQUENCY.ONE_TIME]: "Pago único",
  [PAYMENT_FREQUENCY.WEEKLY]: "Semanal",
  [PAYMENT_FREQUENCY.BIWEEKLY]: "Quincenal",
  [PAYMENT_FREQUENCY.MONTHLY]: "Mensual",
};

export const PAYMENT_FREQUENCY_OPTIONS = (
  [
    PAYMENT_FREQUENCY.NONE,
    PAYMENT_FREQUENCY.ONE_TIME,
    PAYMENT_FREQUENCY.WEEKLY,
    PAYMENT_FREQUENCY.BIWEEKLY,
    PAYMENT_FREQUENCY.MONTHLY,
  ] as TPaymentFrequencyId[]
).map((id) => ({
  value: id,
  name: PAYMENT_FREQUENCY_LABEL[id],
}));
