"use client";

import { CreditCard, Sparkles } from "lucide-react";
import { Badge, Card, CardContent } from "@/components";
import { currencyFormat, formatDate } from "@/utils";
import {
  getSubscriptionDaysLabel,
  getSubscriptionDisplayStatus,
  getSubscriptionExpirationLabel,
  getSubscriptionProgressPct,
} from "@/features/dashboard/modules/account/modules/billing/utils";
import type { ITenantSubscriptionSummary } from "../interfaces";

const STATUS_BADGE = {
  active: { label: "Activa", variant: "success" as const },
  expiring: { label: "Por vencer", variant: "secondary" as const },
  expired: { label: "Expirada", variant: "destructive" as const },
  unknown: { label: "Sin estado", variant: "muted" as const },
};

const DetailTile = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-xl border border-white/6 bg-ink-950/50 px-4 py-3">
    <p className="text-[11px] font-medium tracking-[0.04em] text-ink-400 uppercase">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-ink-50">{value}</p>
  </div>
);

type Props = {
  subscription: ITenantSubscriptionSummary | null;
};

export const TenantSubscriptionSection = ({ subscription }: Props) => {
  if (!subscription) {
    return (
      <Card className="overflow-hidden border-ink-200/8 bg-ink-900/80 shadow-none">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-ink-200/8 bg-ink-900">
            <CreditCard className="size-5 text-ink-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-ink-50">Sin suscripción</h3>
            <p className="text-sm text-ink-400">
              No hay una suscripción registrada para este consultorio.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayStatus = getSubscriptionDisplayStatus(
    subscription.daysRemaining,
    subscription.statusName,
  );
  const badge = STATUS_BADGE[displayStatus];
  const expirationLabel = getSubscriptionExpirationLabel(
    subscription.endsAt,
    subscription.daysRemaining,
  );
  const progressPct = getSubscriptionProgressPct(
    subscription.startsAt,
    subscription.endsAt,
    subscription.daysRemaining,
  );
  const daysLabel = getSubscriptionDaysLabel(subscription.daysRemaining);
  const formatMax = (value: number | null | undefined) =>
    value != null ? String(value) : "—";

  return (
    <Card className="overflow-hidden border-ink-200/8 bg-linear-to-br from-ink-900 via-ink-900 to-accent-500/10 shadow-none">
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
              <h2 className="text-3xl font-semibold tracking-tight text-ink-50">
                {subscription.planName}
              </h2>
              <p className="mt-1 text-sm text-ink-300">{expirationLabel}</p>
            </div>
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-400">
            <span>Tiempo restante</span>
            <span className="font-medium text-ink-200">{daysLabel}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink-800/90">
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
          <DetailTile
            label="Estado"
            value={subscription.statusName || badge.label}
          />
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

        <div className="grid gap-3 sm:grid-cols-3">
          <DetailTile label="Profesionales" value={formatMax(subscription.maxProfessionals)} />
          <DetailTile label="Asistentes" value={formatMax(subscription.maxAssistants)} />
          <DetailTile label="Pacientes" value={formatMax(subscription.maxPatients)} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailTile label="Precio" value={currencyFormat(subscription.price)} />
          <DetailTile
            label="Suscripción"
            value={`#${subscription.idTenantSubscription}`}
          />
        </div>

        {subscription.isPromotionActive && subscription.promotionEndsAt ? (
          <DetailTile
            label="Promoción vigente hasta"
            value={formatDate(subscription.promotionEndsAt, "d MMM yyyy")}
          />
        ) : null}
      </CardContent>
    </Card>
  );
};
