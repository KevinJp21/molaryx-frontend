"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
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
      <section className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium text-ink-50">Tenants</h1>
          <p className="text-sm text-ink-300">
            Tenants registrados en la plataforma Molaryx.
          </p>
        </div>
        {canCreate && (
          <Button type="button" onClick={() => setCreateModalOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Crear Business
          </Button>
        )}
      </section>

      <TenantsTable
        refreshKey={listRefreshKey}
        onRefresh={refreshTenantsList}
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
