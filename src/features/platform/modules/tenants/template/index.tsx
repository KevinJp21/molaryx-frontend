"use client";

import { TenantsTable } from "../components";

export const TenantsTemplate = () => {
  return (
    <>
      <section className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-ink-50">Tenants</h1>
        <p className="text-sm text-ink-300">
          Tenants registrados en la plataforma Molaryx.
        </p>
      </section>

      <TenantsTable />
    </>
  );
};
