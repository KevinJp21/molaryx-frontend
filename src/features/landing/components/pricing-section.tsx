"use client";

import { ErrorMessage } from "@/components";
import type { IGetPublicPlans } from "@/features/public-plans";
import { PLAN_UI_META } from "../const";
import { Reveal, SectionHeading } from "./motion";
import { PricingCard, PricingFounderCallout } from "./pricing";

interface IPricingSectionProps {
  plans: IGetPublicPlans[];
  plansError?: string;
}

export const PricingSection = ({ plans, plansError }: IPricingSectionProps) => {
  const hasError = plans.length === 0 && plansError != null;

  return (
    <section id="pricing" className="container-py relative">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-100 w-1/2 -translate-x-1/2 rounded-full bg-accent-500/10 blur-[150px]" />

      <div className="default-container container-px mx-auto w-full min-w-0">
        <SectionHeading
          eyebrow="Planes"
          titleLines={[
            "Un plan para cada",
            <span key="highlight" className="gradient-text">
              etapa de tu consultorio
            </span>,
          ]}
          description="Elige el plan que se ajuste al tamaño de tu equipo. Precio Founder disponible durante el lanzamiento, para consultorios de cualquier especialidad."
          eyebrowDuration={0.5}
          titleStagger={0.05}
          titleDuration={0.75}
          descriptionDelay={0.05}
          descriptionDuration={0.55}
          scrollStart="top 90%"
        />

        <Reveal variant="up" duration={0.55} start="top 90%">
          <PricingFounderCallout />
        </Reveal>

        {hasError ? (
          <div className="mx-auto mt-10 max-w-md">
            <ErrorMessage message={plansError} />
          </div>
        ) : (
          <Reveal
            className="mx-auto mt-10 grid w-full min-w-0 max-w-6xl gap-6 md:grid-cols-2 md:items-stretch lg:grid-cols-3"
            stagger={0.06}
            duration={0.55}
            start="top 90%"
          >
            {plans.map((plan) => {
              const meta = PLAN_UI_META[plan.idPlan] ?? {
                featured: false,
                ctaLabel: `Comenzar con ${plan.name}`,
              };

              return (
                <PricingCard key={plan.idPlan} plan={plan} meta={meta} />
              );
            })}
          </Reveal>
        )}

        <Reveal variant="fade" duration={0.5} start="top 92%">
          <p className="mt-10 text-center text-xs text-ink-600">
            Precios en pesos colombianos (COP). El precio Founder aplica a los planes con la
            promoción activa.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
