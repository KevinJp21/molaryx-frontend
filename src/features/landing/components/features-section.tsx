import type { ReactNode } from "react";
import { FEATURES, type TFeatureId } from "../const";
import { FeatureItem, PatientsVisual, AgendaVisual, AppointmentsVisual, PaymentsVisual, ServicesVisual, AdminVisual } from "./features";

const FEATURE_VISUALS: Record<TFeatureId, ReactNode> = {
  patients: <PatientsVisual />,
  agenda: <AgendaVisual />,
  appointments: <AppointmentsVisual />,
  payments: <PaymentsVisual />,
  services: <ServicesVisual />,
  admin: <AdminVisual />,
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="container-py relative">
      <div className="default-container container-px mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-400/90">
            Funcionalidades
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-ink-50 sm:text-4xl lg:text-5xl">
            Una plataforma, todo lo que tu consultorio necesita
          </h2>
          <p className="mt-5 text-ink-200">
            Cada módulo de Molaryx está diseñado para una parte real de tu operación, con la
            profundidad que un consultorio moderno exige.
          </p>
        </div>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {FEATURES.map((feature, index) => (
            <FeatureItem
              key={feature.id}
              feature={feature}
              visual={FEATURE_VISUALS[feature.id]}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
