"use client";

import { CreditCard, Sparkles } from "lucide-react";
import { Badge, Card, CardContent, Skeleton } from "@/components";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { useAppSelector } from "@/store";
import { formatDate } from "@/utils";
import { AccountSettingsCard } from "../../../components";
import {
  getSubscriptionDaysLabel,
  getSubscriptionDisplayStatus,
  getSubscriptionExpirationLabel,
  getSubscriptionProgressPct,
} from "../utils";

const STATUS_BADGE = {
  active: { label: "Activa", variant: "success" as const },
  expiring: { label: "Por vencer", variant: "secondary" as const },
  expired: { label: "Expirada", variant: "destructive" as const },
  unknown: { label: "Sin estado", variant: "muted" as const },
};

const BillingSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Card className="overflow-hidden border-ink-800/8 bg-ink-100/80 shadow-none">
      <CardContent className="space-y-5 p-6">
        <Skeleton className="h-4 w-28 rounded bg-ink-300" />
        <Skeleton className="h-10 w-2/3 rounded bg-ink-300" />
        <Skeleton className="h-3 w-full rounded-full bg-ink-300" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl bg-ink-200" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const DetailTile = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-xl border border-ink-800/6 bg-ink-50/50 px-4 py-3">
    <p className="text-[11px] font-medium tracking-[0.04em] text-ink-600 uppercase">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-ink-950">{value}</p>
  </div>
);

export const BillingTemplate = () => {
  const { data: userData, status: userStatus } = useAppSelector(selectGetUserData);
  const subscription = userData?.subscription;
  const isLoading = userStatus === "loading" || userStatus === "idle";

  const displayStatus = getSubscriptionDisplayStatus(
    subscription?.daysRemaining,
    subscription?.statusName,
  );
  const badge = STATUS_BADGE[displayStatus];
  const expirationLabel = getSubscriptionExpirationLabel(
    subscription?.endsAt,
    subscription?.daysRemaining,
  );
  const progressPct = getSubscriptionProgressPct(
    subscription?.startsAt,
    subscription?.endsAt,
    subscription?.daysRemaining,
  );
  const daysLabel = getSubscriptionDaysLabel(subscription?.daysRemaining);

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
          Facturación
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Consulta el estado de tu plan y el periodo de vigencia de tu suscripción.
        </p>
      </div>

      {isLoading ? (
        <BillingSkeleton />
      ) : !subscription ? (
        <AccountSettingsCard
          title="Sin suscripción"
          description="No encontramos una suscripción asociada a tu consultorio."
          action={
            <div className="flex size-12 items-center justify-center rounded-2xl border border-ink-800/8 bg-ink-100">
              <CreditCard className="size-5 text-ink-600" />
            </div>
          }
          footer={
            <span>
              Si crees que esto es un error, contacta al equipo de Molaryx para
              revisar tu cuenta.
            </span>
          }
        />
      ) : (
        <Card className="overflow-hidden border-ink-800/8 bg-linear-to-br from-ink-100 via-ink-100 to-accent-500/10 shadow-none">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-accent-300">
                  <Sparkles className="size-4" />
                  <span className="text-xs font-medium tracking-[0.08em] uppercase">
                    Plan actual
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-ink-950">
                    {subscription.planName}
                  </h2>
                  <p className="mt-1 text-sm text-ink-700">{expirationLabel}</p>
                </div>
              </div>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-600">
                <span>Tiempo restante</span>
                <span className="font-medium text-ink-800">{daysLabel}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-200/90">
                <div
                  className={`h-full rounded-full transition-[width] ${
                    displayStatus === "expired"
                      ? "bg-coral-500"
                      : displayStatus === "expiring"
                        ? "bg-amber-400"
                        : "bg-accent-500"
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <DetailTile label="Estado" value={subscription.statusName || badge.label} />
              <DetailTile
                label="Inicio"
                value={
                  subscription.startsAt
                    ? formatDate(subscription.startsAt, "d MMM yyyy")
                    : "—"
                }
              />
              <DetailTile
                label="Vencimiento"
                value={
                  subscription.endsAt
                    ? formatDate(subscription.endsAt, "d MMM yyyy")
                    : "—"
                }
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
