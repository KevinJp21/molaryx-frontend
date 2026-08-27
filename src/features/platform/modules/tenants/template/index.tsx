"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { checkCanCreateBusinessTenant } from "@/features/platform/utils";
import {
  CreateBusinessTenantModal,
  TenantsTable,
} from "../components";

export const TenantsTemplate = () => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canCreate = checkCanCreateBusinessTenant(userData?.permissions);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const refreshTenantsList = () => {
    setListRefreshKey((key) => key + 1);
  };

  return (
    <>
      <section className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-ink-50">Tenants</h1>
        <p className="text-sm text-ink-300">
          Tenants registrados en la plataforma Molaryx.
        </p>
      </section>

      <TenantsTable
        refreshKey={listRefreshKey}
        onRefresh={refreshTenantsList}
        onCreate={() => setCreateModalOpen(true)}
        canCreate={canCreate}
      />

      {canCreate && (
        <CreateBusinessTenantModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSuccess={refreshTenantsList}
        />
      )}
    </>
  );
};
