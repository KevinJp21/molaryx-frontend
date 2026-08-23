"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { checkCanCreate } from "@/features/dashboard/utils";
import { PERMISSION_MODULES } from "@/features/dashboard/consts";
import { MemberFormModal, TeamTable } from "../components";

export const TeamTemplate = () => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canCreate = checkCanCreate(
    userData?.permissions,
    PERMISSION_MODULES.USERS,
  );

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const refreshTeamList = () => {
    setListRefreshKey((key) => key + 1);
  };

  return (
    <>
      <section className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-ink-50">Equipo</h1>
        <p className="text-sm text-ink-300">
          Profesionales y asistentes: busca, filtra y gestiona miembros
        </p>
      </section>

      <TeamTable
        onCreate={() => setMemberModalOpen(true)}
        canCreate={canCreate}
        refreshKey={listRefreshKey}
      />

      {canCreate && (
        <MemberFormModal
          open={memberModalOpen}
          onOpenChange={setMemberModalOpen}
          onSuccess={refreshTeamList}
        />
      )}
    </>
  );
};
