import { Sparkles, Check } from "lucide-react";

export const PricingFounderCallout = () => {
  return (
    <div className="mx-auto mt-10 w-full min-w-0 max-w-4xl rounded-2xl border border-accent-500/25 bg-accent-500/8 px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300 ring-1 ring-inset ring-accent-500/20">
          <Sparkles className="size-5" strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-400/90">
            Programa Founder
          </span>

          <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl">
            Una oportunidad exclusiva para los primeros consultorios
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed wrap-break-word text-ink-800 sm:text-base">
            Durante el lanzamiento, el plan{" "}
            <strong className="text-ink-950">Professional</strong> tiene un{" "}
            <strong className="text-ink-950">precio Founder</strong> para los primeros
            consultorios que quieran operar con Molaryx desde el inicio.
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed wrap-break-word text-ink-700 sm:text-base">
            Tendrás acceso a todas las funcionalidades del plan Professional con un precio
            preferencial por tiempo limitado, como reconocimiento por confiar en Molaryx desde
            sus primeros pasos.
          </p>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
            <li className="flex min-w-0 items-start gap-2 text-sm text-ink-800">
              <Check
                className="mt-0.5 size-4 shrink-0 text-accent-400"
                strokeWidth={2}
              />
              <span className="min-w-0 wrap-break-word">Todas las funcionalidades del plan Professional.</span>
            </li>

            <li className="flex min-w-0 items-start gap-2 text-sm text-ink-800">
              <Check
                className="mt-0.5 size-4 shrink-0 text-accent-400"
                strokeWidth={2}
              />
              <span className="min-w-0 wrap-break-word">Precio Founder exclusivo durante el lanzamiento.</span>
            </li>

            <li className="flex min-w-0 items-start gap-2 text-sm text-ink-800">
              <Check
                className="mt-0.5 size-4 shrink-0 text-accent-400"
                strokeWidth={2}
              />
              <span className="min-w-0 wrap-break-word">Cupos limitados para los primeros consultorios registrados.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};