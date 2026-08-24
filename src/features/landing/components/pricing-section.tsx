"use client";

import { useEffect } from "react";
import { ErrorMessage, Skeleton } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getPublicPlans,
  selectGetPublicPlans,
} from "@/store/plans/plans-slice";
import { PLAN_UI_META } from "../const";
import { PricingCard, PricingFounderCallout } from "./pricing";

const PricingCardsSkeleton = () => (
  <div className="mx-auto mt-10 grid w-full min-w-0 max-w-6xl gap-6 md:grid-cols-2 md:items-start lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="flex h-full w-full flex-col rounded-2xl border border-white/8 bg-ink-900/40 p-5 sm:p-8"
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
        <div className="mx-auto w-full min-w-0 max-w-2xl text-center">
          <span className="inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-400/90">
            Planes
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-ink-50 sm:text-4xl lg:text-5xl">
            Un plan para cada{" "}
            <span className="gradient-text">etapa de tu consultorio</span>
          </h2>
          <p className="mt-5 text-ink-200">
            Organiza tu consultorio odontológico desde una sola plataforma. Elige el plan
            que se ajuste a tu equipo y aprovecha el precio Founder mientras esté disponible.
          </p>
        </div>

        <PricingFounderCallout />

        {isLoading ? (
          <PricingCardsSkeleton />
        ) : status === "error" ? (
          <div className="mx-auto mt-10 max-w-md">
            <ErrorMessage
              message={message ?? "No se pudieron cargar los planes."}
            />
          </div>
        ) : (
          <div className="mx-auto mt-10 grid w-full min-w-0 max-w-6xl gap-6 md:grid-cols-2 md:items-start lg:grid-cols-3">
            {data?.map((plan) => {
              const meta = PLAN_UI_META[plan.idPlan] ?? {
                featured: false,
                ctaLabel: `Comenzar con ${plan.name}`,
              };

              return (
                <PricingCard key={plan.idPlan} plan={plan} meta={meta} />
              );
            })}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-ink-400">
          Precios en pesos colombianos (COP). El precio Founder aplica a los planes con la
          promoción activa.
        </p>
      </div>
    </section>
  );
};
