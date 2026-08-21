"use client";

import { toast } from "sonner";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import {
  Avatar,
  AvatarFallback,
  Button,
  Input,
} from "@/components";
import { AccountSettingsCard } from "../components";

export const ProfileTemplate = () => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const fullName = userData
    ? `${userData.names} ${userData.surnames}`.trim()
    : "";
  const initials = `${userData?.names?.charAt(0) ?? ""}${userData?.surnames?.charAt(0) ?? ""}`;

  const handleComingSoon = () => {
    toast.info("La edición de perfil estará disponible pronto.");
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-10">
      <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-ink-50">
        Perfil
      </h1>

      <div className="flex flex-col gap-4">
        <AccountSettingsCard
          title="Avatar"
          description="Esta es tu foto de perfil. Aparece en el dashboard y en tu menú de cuenta."
          action={
            <Avatar className="size-16">
              <AvatarFallback className="bg-linear-to-br from-accent-400 to-coral-500 text-base font-semibold text-ink-950">
                {initials || "—"}
              </AvatarFallback>
            </Avatar>
          }
          footer={
            <span>El avatar es opcional, pero ayuda a identificarte en el equipo.</span>
          }
        />

        <AccountSettingsCard
          title="Nombre para mostrar"
          description="Introduce un nombre para mostrar. Puede ser tu nombre real o un seudónimo."
          footer={
            <>
              <span>Máximo 64 caracteres.</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleComingSoon}
              >
                Guardar
              </Button>
            </>
          }
        >
          <Input
            defaultValue={fullName}
            maxLength={64}
            readOnly
            aria-label="Nombre para mostrar"
          />
        </AccountSettingsCard>

        <AccountSettingsCard
          title="Nombre de usuario"
          description="Es tu identificador único dentro de Molaryx."
          footer={
            <>
              <span>Máximo 48 caracteres.</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleComingSoon}
              >
                Guardar
              </Button>
            </>
          }
        >
          <div className="flex overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
            <span className="flex shrink-0 items-center border-r border-ink-700 px-3 text-sm text-ink-400">
              molaryx.app/
            </span>
            <Input
              defaultValue={userData?.username ?? ""}
              maxLength={48}
              readOnly
              className="rounded-none border-0 bg-transparent focus-visible:ring-0"
              aria-label="Nombre de usuario"
            />
          </div>
        </AccountSettingsCard>

        <AccountSettingsCard
          title="Correo electrónico"
          description="Dirección asociada a tu cuenta. Se usa para iniciar sesión y notificaciones."
          footer={
            <>
              <span>Contacta a soporte si necesitas cambiarlo.</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleComingSoon}
              >
                Guardar
              </Button>
            </>
          }
        >
          <Input
            type="email"
            defaultValue={userData?.email ?? ""}
            readOnly
            aria-label="Correo electrónico"
          />
        </AccountSettingsCard>
      </div>
    </div>
  );
};
