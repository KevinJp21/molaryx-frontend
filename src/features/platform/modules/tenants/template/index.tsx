"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import {
  checkCanCreateBusinessTenant,
  checkCanUpdateTenant,
} from "@/features/platform/utils";
import {
  CreateBusinessTenantModal,
  TenantsTable,
  UpdateTenantFormModal,
} from "../components";
import type { ITenantsItems } from "../interfaces";

export const TenantsTemplate = () => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canCreate = checkCanCreateBusinessTenant(userData?.permissions);
  const canUpdate = checkCanUpdateTenant(userData?.permissions);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<ITenantsItems | null>(
    null,
  );
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const refreshTenantsList = () => {
    setListRefreshKey((key) => key + 1);
  };

  const openEditModal = (tenant: ITenantsItems) => {
    setSelectedTenant(tenant);
    setEditModalOpen(true);
  };

  const handleEditModalOpenChange = (next: boolean) => {
    setEditModalOpen(next);
    if (!next) setSelectedTenant(null);
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
        onEdit={openEditModal}
        canCreate={canCreate}
        canUpdate={canUpdate}
      />

      {canCreate && (
        <CreateBusinessTenantModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSuccess={refreshTenantsList}
        />
      )}

      {canUpdate && (
        <UpdateTenantFormModal
          open={editModalOpen}
          onOpenChange={handleEditModalOpenChange}
          tenant={selectedTenant}
          onSuccess={refreshTenantsList}
        />
      )}
    </>
  );
};
