import type { ReactNode } from "react";
import { FEATURES, type TFeatureId } from "../const";
import {
  FeatureIndex,
  FeatureItem,
  PatientsVisual,
  ClinicalRecordsVisual,
  AgendaVisual,
  AppointmentsVisual,
  PaymentsVisual,
  ServicesVisual,
  AdminVisual,
} from "./features";
import { SectionHeading } from "./motion";

const FEATURE_VISUALS: Record<TFeatureId, ReactNode> = {
  patients: <PatientsVisual />,
  clinical: <ClinicalRecordsVisual />,
  agenda: <AgendaVisual />,
  appointments: <AppointmentsVisual />,
  payments: <PaymentsVisual />,
  services: <ServicesVisual />,
  admin: <AdminVisual />,
};

const INDEX_ITEMS = FEATURES.map((feature) => ({
  id: feature.id,
  title: feature.title,
}));

export const FeaturesSection = () => {
  return (
    <section id="features" className="container-py relative">
      <div className="default-container container-px mx-auto">
        <SectionHeading
          eyebrow="Funcionalidades"
          titleLines={[
            "Todo lo que tu consultorio",
            "necesita, en un solo lugar",
          ]}
          description="Módulos pensados para el día a día de cualquier especialidad: pacientes, historia clínica, agenda, procedimientos, tratamientos, pagos y equipo."
        />

        <div className="mt-16 grid gap-12 lg:mt-20 xl:grid-cols-[210px_1fr] xl:gap-16">
          <aside className="hidden xl:block">
            <FeatureIndex items={INDEX_ITEMS} />
          </aside>

          <div className="min-w-0 space-y-16 lg:space-y-24">
            {FEATURES.map((feature, index) => (
              <FeatureItem
                key={feature.id}
                feature={feature}
                visual={FEATURE_VISUALS[feature.id]}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
