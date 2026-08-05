import { PLANS, PLAN_UI_META } from "../const";
import { PricingCard, PricingFounderCallout } from "./pricing";

export const PricingSection = () => {
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

        <div className="mx-auto mt-10 grid w-full min-w-0 max-w-4xl gap-6 md:grid-cols-2 md:items-start">
          {PLANS.map((plan) => {
            const meta = PLAN_UI_META[plan.idPlan];
            if (!meta) return null;

            return <PricingCard key={plan.idPlan} plan={plan} meta={meta} />;
          })}
        </div>

        <p className="mt-10 text-center text-xs text-ink-400">
          Precios en pesos colombianos (COP). El precio Founder aplica a los planes con la
          promoción activa.
        </p>
      </div>
    </section>
  );
};
