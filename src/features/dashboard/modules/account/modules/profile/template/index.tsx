"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  Input,
  Skeleton,
} from "@/components";
import { formatDate } from "@/utils";
import { memberFullName } from "@/features/dashboard/modules/team/utils";
import { AccountSettingsCard } from "../../../components";
import { apiGetProfileAction } from "../actions";
import { IGetProfileResponseData } from "../interfaces";

const ProfileField = ({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-xs text-ink-600">
      {label}
    </label>
    <Input id={id} value={value} readOnly aria-label={label} />
  </div>
);

const ProfileFieldsSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="space-y-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
  </div>
);

export const ProfileTemplate = () => {
  const [profile, setProfile] = useState<IGetProfileResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      const result = await apiGetProfileAction();

      if (cancelled) return;

      if (!result.success || !result.data) {
        toast.error(result.message ?? "No se pudo cargar el perfil.");
        setIsLoading(false);
        return;
      }

      setProfile(result.data);
      setIsLoading(false);
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const fullName = profile
    ? memberFullName(
        profile.firstName,
        profile.secondName,
        profile.firstSurname,
        profile.secondSurname,
      )
    : "";
  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.firstSurname.charAt(0)}`
    : "—";
  const birthDate = profile?.birthDate
    ? formatDate(profile.birthDate, "d MMMM yyyy")
    : "—";
  const tenantDocument =
    profile?.tenant?.identificationType && profile.tenant.identificationNumber
      ? `${profile.tenant.identificationType} · ${profile.tenant.identificationNumber}`
      : "—";

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-10">
      <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-ink-950">
        Perfil
      </h1>

      <div className="flex flex-col gap-4">
        <AccountSettingsCard
          title="Resumen"
          description="Información general de tu cuenta en Molaryx."
          action={
            <Avatar className="size-16">
              <AvatarFallback className="bg-linear-to-br from-accent-400 to-coral-500 text-base font-semibold text-ink-50">
                {initials}
              </AvatarFallback>
            </Avatar>
          }
          footer={
            <span>
              Los datos del perfil son de solo lectura. La edición estará
              disponible próximamente.
            </span>
          }
        />

        <AccountSettingsCard
          title="Datos personales"
          description="Información de identificación y contacto asociada a tu usuario."
        >
          {isLoading ? (
            <ProfileFieldsSkeleton />
          ) : profile ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField id="fullName" label="Nombre completo" value={fullName} />
              <ProfileField
                id="username"
                label="Nombre de usuario"
                value={profile.username}
              />
              <ProfileField
                id="identification"
                label="Documento"
                value={`${profile.identificationType} · ${profile.identificationNumber}`}
              />
              <ProfileField id="birthDate" label="Fecha de nacimiento" value={birthDate} />
              <ProfileField id="phoneNumber" label="Teléfono" value={profile.phoneNumber} />
              <ProfileField id="email" label="Correo electrónico" value={profile.email} />
            </div>
          ) : null}
        </AccountSettingsCard>

        <AccountSettingsCard
          title="Cuenta"
          description="Rol y estado actual de tu usuario en el consultorio."
        >
          {isLoading ? (
            <ProfileFieldsSkeleton />
          ) : profile ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField id="roleName" label="Rol" value={profile.roleName} />
              <ProfileField id="statusName" label="Estado" value={profile.statusName} />
            </div>
          ) : null}
        </AccountSettingsCard>

        {!isLoading && profile?.tenant ? (
          <AccountSettingsCard
            title="Consultorio"
            description="Datos del consultorio asociados a tu cuenta de propietario."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField
                id="consultoryName"
                label="Nombre del consultorio"
                value={profile.tenant.consultoryName}
              />
              <ProfileField
                id="tenantEmail"
                label="Correo del consultorio"
                value={profile.tenant.email}
              />
              <ProfileField
                id="tenantPhone"
                label="Teléfono del consultorio"
                value={profile.tenant.phoneNumber}
              />
              <ProfileField
                id="tenantDocument"
                label="Documento del consultorio"
                value={tenantDocument}
              />
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="tenantAddress" className="text-xs text-ink-600">
                  Dirección
                </label>
                <Input
                  id="tenantAddress"
                  value={profile.tenant.address}
                  readOnly
                  aria-label="Dirección del consultorio"
                />
              </div>
            </div>
          </AccountSettingsCard>
        ) : null}
      </div>
    </div>
  );
};
