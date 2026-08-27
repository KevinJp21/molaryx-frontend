"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AppointmentsCalendar } from "../components/appointments-calendar";
import { AppointmentsListTable } from "../components/appointments-list-table";

type TAppointmentsView = "calendar" | "list";

export const AppointmentsTemplate = () => {
  const [view, setView] = useState<TAppointmentsView>("calendar");

  return (
    <>
      <section className="mb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-medium text-ink-950">Citas</h1>
            <p className="text-sm text-ink-700">
              {view === "calendar"
                ? "Agenda de la clínica por día, semana y mes"
                : "Listado de citas"}
            </p>
          </div>
        </div>
        <nav className="flex gap-1 border-b border-ink-200">
          {(
            [
              { id: "calendar", label: "Calendario" },
              { id: "list", label: "Lista" },
            ] as const
          ).map((tab) => {
            const isActive = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={cn(
                  "px-3 py-2 text-sm border-b-2 -mb-px",
                  isActive
                    ? "border-accent-500 text-ink-950"
                    : "border-transparent text-ink-600 hover:text-ink-800",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </section>
      {view === "calendar" ? (
        <AppointmentsCalendar />
      ) : (
        <AppointmentsListTable />
      )}
    </>
  );
};
