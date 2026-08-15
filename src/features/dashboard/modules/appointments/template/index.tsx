"use client";

import { AppointmentsCalendar } from "../components";

export const AppointmentsTemplate = () => {
  return (
    <>
      <section className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium text-ink-50">Citas</h1>
          <p className="text-sm text-ink-300">
            Agenda de la clínica por día, semana y mes
          </p>
        </div>
      </section>
      <AppointmentsCalendar />
    </>
  );
};
