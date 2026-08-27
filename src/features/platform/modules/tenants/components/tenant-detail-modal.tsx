"use client";

import { useEffect } from "react";
import { Building2, CheckCircle2, Mail, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Badge, BaseModal, Button, Spinner } from "@/components";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import {
  postActivateTenant,
  resetPostActivateTenant,
  selectPostActivateTenant,
} from "@/store/tenants/tenants-slice";
import { checkCanActivateTenant } from "@/features/platform/utils";
import { TenantSubscriptionSection } from "./tenant-subscription-section";
import {
  getTenantStatusChipClass,
  getTenantStatusColor,
  getTenantTypeBadgeVariant,
  getUserStatusBadgeVariant,
  getUserStatusLabel,
  TENANT_STATUS,
} from "../consts";
import type { ITenantsItems } from "../interfaces";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  tenant: ITenantsItems | null;
  onSuccess?: () => void;
};

const Field = ({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | null;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <span className="text-xs text-ink-400">{label}</span>
    <span className="text-sm text-ink-100">{value?.trim() ? value : "—"}</span>
  </div>
);

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4 rounded-xl border border-ink-800 bg-ink-900/30 p-4">
    <div className="flex items-center gap-2">
      <span className="inline-flex size-7 items-center justify-center rounded-lg bg-accent-500/10 text-accent-300 ring-1 ring-inset ring-accent-500/20">
        <Icon className="size-3.5" strokeWidth={2} />
      </span>
      <h3 className="text-sm font-medium text-ink-50">{title}</h3>
    </div>
    {children}
  </section>
);

const InfoTile = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-ink-800 bg-ink-900/20 p-3">
    <Icon className="mt-0.5 size-4 shrink-0 text-ink-400" strokeWidth={1.75} />
    <div className="min-w-0">
      <p className="text-[11px] text-ink-400">{label}</p>
      <p className="truncate text-sm text-ink-100">{value}</p>
    </div>
  </div>
);

export const TenantDetailModal = ({
  open,
  onOpenChange,
  tenant,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data: userData } = useAppSelector(selectGetUserData);
  const { status, message } = useAppSelector(selectPostActivateTenant);
  const isActivating = status === "loading";

  const canActivate = checkCanActivateTenant(userData?.permissions);
  const isPending =
    tenant?.idTenantStatus === TENANT_STATUS.PENDING;
  const canSubmitActivate = Boolean(
    tenant?.owner?.idUser && tenant?.subscription?.idTenantSubscription,
  );
  const showActivateButton = Boolean(tenant && isPending && canActivate);

  const handleDialogOpenChange = (next: boolean) => {
    if (!next && status !== "idle") {
      dispatch(resetPostActivateTenant());
    }
    onOpenChange(next);
  };

  const handleActivate = () => {
    if (!tenant?.owner || !tenant.subscription) {
      toast.error(
        "No se puede activar: faltan datos del propietario o de la suscripción.",
      );
      return;
    }

    dispatch(
      postActivateTenant({
        idUser: tenant.owner.idUser,
        idTenant: tenant.idTenant,
        idTenantSubscription: tenant.subscription.idTenantSubscription,
      }),
    );
  };

  useEffect(() => {
    if (status === "error") {
      toast.error(message ?? "No se pudo activar la cuenta.");
      dispatch(resetPostActivateTenant());
    }
    if (status === "success") {
      toast.success(message ?? "Cuenta activada de manera exitosa.");
      dispatch(resetPostActivateTenant());
      handleDialogOpenChange(false);
      onSuccess?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync con status de activación
  }, [status, dispatch, message]);

  if (!tenant) return null;

  const { owner, subscription } = tenant;
  const statusColor = getTenantStatusColor(tenant.idTenantStatus);
  const statusChipClass = getTenantStatusChipClass(tenant.idTenantStatus);
  const identificationLabel = tenant.identificationNumber
    ? `${tenant.identificationCode || "ID"} · ${tenant.identificationNumber}`
    : "—";

  return (
    <BaseModal
      open={open}
      onOpenChange={handleDialogOpenChange}
      icon={<Building2 className="size-3.5" strokeWidth={2} />}
      title={tenant.consultoryName}
      description="Detalle del Tenant"
      className="max-w-3xl"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                statusChipClass,
              )}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              {tenant.tenantStatusName}
            </span>
            <Badge variant={getTenantTypeBadgeVariant(tenant.idTenantType)}>
              {tenant.tenantTypeCode}
            </Badge>
            <span className="inline-flex items-center rounded-full bg-ink-800 px-2.5 py-1 font-mono text-[11px] tabular-nums text-ink-200 ring-1 ring-inset ring-ink-700">
              #{tenant.idTenant}
            </span>

            {showActivateButton && (
              <Button
                type="button"
                size="sm"
                className="ml-auto"
                disabled={isActivating || !canSubmitActivate}
                onClick={handleActivate}
              >
                {isActivating ? (
                  <>
                    <Spinner className="size-3.5" />
                    Activando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" strokeWidth={2} />
                    Activar
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoTile label="Correo" value={tenant.email || "—"} icon={Mail} />
            <InfoTile
              label="Teléfono"
              value={tenant.phoneNumber || "—"}
              icon={Phone}
            />
          </div>

          <TenantSubscriptionSection subscription={subscription} />

          <SectionCard title="Consultorio" icon={Building2}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nombre comercial" value={tenant.consultoryName} />
              <Field label="Identificación" value={identificationLabel} />
              <Field label="Dirección" value={tenant.address} className="md:col-span-2" />
            </div>
          </SectionCard>

          <SectionCard title="Propietario" icon={UserRound}>
            {owner ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex min-w-0 items-start justify-between gap-3 md:col-span-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-50">{owner.name}</p>
                    <p className="truncate text-xs text-ink-400">@{owner.username}</p>
                  </div>
                  <Badge variant={getUserStatusBadgeVariant(owner.idUserStatus)}>
                    {getUserStatusLabel(owner.idUserStatus, owner.userStatusName)}
                  </Badge>
                </div>
                <Field label="Correo" value={owner.email} />
                <Field label="Teléfono" value={owner.phoneNumber} />
                <Field
                  label={owner.identificationCode || "Identificación"}
                  value={owner.identificationNumber}
                  className="md:col-span-2"
                />
              </div>
            ) : (
              <p className="text-sm text-ink-400">Sin propietario registrado.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </BaseModal>
  );
};
