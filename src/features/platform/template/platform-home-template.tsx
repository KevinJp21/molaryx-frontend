"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components";
import { checkCanViewTenants } from "../utils";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";

export const PlatformHomeTemplate = () => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canViewTenants = checkCanViewTenants(userData?.permissions);

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <div className="rounded-3xl border border-ink-200 bg-linear-to-br from-ink-100/60 to-ink-100/20 p-5">
        <Building2 className="size-12 text-accent-400/80" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 text-xl font-medium text-ink-950">
        Administración de plataforma
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">
        Gestiona tenants y cuentas desde el panel de Super Admin.
      </p>
      {canViewTenants && (
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/platform/tenants">Ir a tenants</Link>
        </Button>
      )}
    </section>
  );
};
