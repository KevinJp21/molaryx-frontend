"use client";

import { useState } from "react";
import { MemberFormModal, TeamTable } from "../components";

export const TeamTemplate = () => {
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

      <TeamTable onCreate={() => setMemberModalOpen(true)} refreshKey={listRefreshKey} />

      <MemberFormModal
        open={memberModalOpen}
        onOpenChange={setMemberModalOpen}
        onSuccess={refreshTeamList}
      />
    </>
  );
};
