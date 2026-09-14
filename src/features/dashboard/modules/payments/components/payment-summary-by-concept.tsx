"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getPaymentsSummaryByConcept,
  resetGetPaymentsSummaryByConcept,
  selectGetPaymentsSummaryByConcept,
} from "@/store/payments/payments-slice";
import { currencyFormat } from "@/utils";
import { cn } from "@/lib/utils";
import { Skeleton, ErrorMessage } from "@/components";

type Props = {
  open: boolean;
  idAppointment?: number;
  idPatientTreatment?: number;
  refreshKey?: number;
};

const PROGRESS_WIDTH_CLASSES = [
  "w-0",
  "w-[5%]",
  "w-[10%]",
  "w-[15%]",
  "w-[20%]",
  "w-[25%]",
  "w-[30%]",
  "w-[35%]",
  "w-[40%]",
  "w-[45%]",
  "w-[50%]",
  "w-[55%]",
  "w-[60%]",
  "w-[65%]",
  "w-[70%]",
  "w-[75%]",
  "w-[80%]",
  "w-[85%]",
  "w-[90%]",
  "w-[95%]",
  "w-full",
] as const;

const progressWidthClass = (progress: number) =>
  PROGRESS_WIDTH_CLASSES[Math.min(20, Math.max(0, Math.round(progress / 5)))];

const Metric = ({
  label,
  value,
  emphasize,
  priceColumnClassName,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  priceColumnClassName?: string;
}) => (
  <div className="flex min-w-0 flex-col gap-1">
    <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-600">
      {label}
    </span>
    <span
      className={cn(
        "truncate text-sm tabular-nums font-semibold",
        priceColumnClassName,
        emphasize ? "text-accent-600" : "text-ink-950",
      )}
    >
      {value}
    </span>
  </div>
);

export const PaymentSummaryByConcept = ({
  open,
  idAppointment,
  idPatientTreatment,
  refreshKey = 0,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status, message, error } = useAppSelector(
    selectGetPaymentsSummaryByConcept,
  );

  useEffect(() => {
    if (!open) {
      dispatch(resetGetPaymentsSummaryByConcept());
      return;
    }

    if (idAppointment) {
      dispatch(getPaymentsSummaryByConcept({ IdAppointment: idAppointment }));
      return;
    }

    if (idPatientTreatment) {
      dispatch(
        getPaymentsSummaryByConcept({
          IdPatientTreatment: idPatientTreatment,
        }),
      );
    }
  }, [open, idAppointment, idPatientTreatment, refreshKey, dispatch]);

  const billed = data?.price ?? data?.agreedPrice ?? null;
  const billedLabel = idPatientTreatment ? "Precio acordado" : "Precio";
  const remainingValue =
    data?.remaining == null ? "—" : currencyFormat(data.remaining);
  const hasCredit = data?.credit != null && data.credit > 0;
  const paymentCountLabel =
    !data || data.paymentCount === 0
      ? "Sin abonos"
      : data.paymentCount === 1
        ? "1 abono"
        : `${data.paymentCount} abonos`;
  const progress =
    billed != null && billed > 0 && data
      ? Math.min(100, Math.max(0, (data.totalPaid / billed) * 100))
      : null;
  const remainingEmphasize =
    data?.remaining != null && data.remaining > 0;

  return (
    <div className="rounded-lg border border-ink-200 bg-ink-100/30 p-4">
      {(status === "loading" || status === "idle") && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      )}

      {status === "error" && (
        <ErrorMessage message={message} error={error} />
      )}

      {status === "success" && data && (
        <div className="flex flex-col gap-3">
          <div
            className={cn(
              "grid grid-cols-1 gap-4",
              hasCredit ? "md:grid-cols-4" : "md:grid-cols-3",
            )}
          >
            <Metric
              label={billedLabel}
              value={billed == null ? "Sin precio pactado" : currencyFormat(billed)}
            />
            <Metric
              label="Total abonado"
              priceColumnClassName="text-emerald-600!"
              value={currencyFormat(data.totalPaid)}
            />
            <Metric
              label="Saldo pendiente"
              value={remainingValue}
              emphasize={remainingEmphasize}
            />
            {hasCredit && data.credit != null && (
              <Metric
                label="Saldo a favor"
                value={currencyFormat(data.credit)}
                emphasize
              />
            )}
          </div>
          {progress != null && (
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-200">
              <div
                className={cn(
                  "h-full rounded-full bg-accent-500",
                  progressWidthClass(progress),
                )}
              />
            </div>
          )}
          <p className="text-xs text-ink-600">{paymentCountLabel}</p>
        </div>
      )}
    </div>
  );
};
