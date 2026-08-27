"use client";

import { useEffect } from "react";
import { ErrorMessage, Skeleton } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getPublicPlans,
  selectGetPublicPlans,
} from "@/store/plans/plans-slice";
import { PLAN_UI_META } from "../const";
import { Reveal, SectionHeading } from "./motion";
import { PricingCard, PricingFounderCallout } from "./pricing";

const PricingCardsSkeleton = () => (
  <div className="mx-auto mt-10 grid w-full min-w-0 max-w-6xl gap-6 md:grid-cols-2 md:items-start lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="flex h-full w-full flex-col rounded-2xl border border-ink-200/8 bg-ink-900/40 p-5 sm:p-8"
      >
        <Skeleton className="h-5 w-28 bg-ink-700" />
        <Skeleton className="mt-3 h-4 w-full max-w-64 bg-ink-800" />
        <Skeleton className="mt-6 h-9 w-36 bg-ink-700" />
        <div className="mt-8 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((__, featureIndex) => (
            <Skeleton
              key={featureIndex}
              className="h-4 w-full max-w-52 bg-ink-800"
            />
          ))}
        </div>
        <Skeleton className="mt-8 h-10 w-full rounded-full bg-ink-700" />
      </div>
    ))}
  </div>
);

export const PricingSection = () => {
  const dispatch = useAppDispatch();
  const { status, data, message } = useAppSelector(selectGetPublicPlans);
  const isLoading = status === "idle" || status === "loading";

  useEffect(() => {
    if (status !== "success") {
      dispatch(getPublicPlans());
    }
  }, [dispatch]);

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
        />

        <Reveal variant="up" delay={0.1}>
          <PricingFounderCallout />
        </Reveal>

        {isLoading ? (
          <PricingCardsSkeleton />
        ) : status === "error" ? (
          <div className="mx-auto mt-10 max-w-md">
            <ErrorMessage
              message={message ?? "No se pudieron cargar los planes."}
            />
          </div>
        ) : (
          <Reveal
            className="mx-auto mt-10 grid w-full min-w-0 max-w-6xl gap-6 md:grid-cols-2 md:items-start lg:grid-cols-3"
            stagger={0.12}
            duration={0.9}
          >
            {data?.map((plan) => {
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

        <Reveal variant="fade" delay={0.1}>
          <p className="mt-10 text-center text-xs text-ink-400">
            Precios en pesos colombianos (COP). El precio Founder aplica a los planes con la
            promoción activa.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
