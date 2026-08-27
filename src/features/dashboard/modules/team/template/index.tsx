"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { checkCanCreate, checkCanUpdate } from "@/features/dashboard/utils";
import { PERMISSION_MODULES } from "@/features/dashboard/consts";
import { MemberFormModal, TeamTable } from "../components";
import { IGetTeamResponseData } from "../interfaces";

export const TeamTemplate = () => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canCreate = checkCanCreate(
    userData?.permissions,
    PERMISSION_MODULES.USERS,
  );
  const canUpdate = checkCanUpdate(
    userData?.permissions,
    PERMISSION_MODULES.USERS,
  );

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<IGetTeamResponseData | null>(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const refreshTeamList = () => {
    setListRefreshKey((key) => key + 1);
  };

  const openCreateModal = () => {
    setSelectedMember(null);
    setMemberModalOpen(true);
  };

  const openEditModal = (member: IGetTeamResponseData) => {
    setSelectedMember(member);
    setMemberModalOpen(true);
  };

  const handleModalOpenChange = (next: boolean) => {
    setMemberModalOpen(next);
    if (!next) setSelectedMember(null);
  };

  return (
    <>
      <section className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-ink-950">Equipo</h1>
        <p className="text-sm text-ink-700">
          Profesionales y asistentes: busca, filtra y gestiona miembros
        </p>
      </section>

      <TeamTable
        onCreate={openCreateModal}
        onEdit={openEditModal}
        canCreate={canCreate}
        canUpdate={canUpdate}
        refreshKey={listRefreshKey}
      />

      {(canCreate || canUpdate) && (
        <MemberFormModal
          open={memberModalOpen}
          onOpenChange={handleModalOpenChange}
          member={selectedMember}
          onSuccess={refreshTeamList}
        />
      )}
    </>
  );
};
