import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components";
import { MaskReveal, Reveal } from "./motion";

export const CtaSection = () => {
  return (
    <section className="container-py relative">
      <div className="default-container container-px mx-auto">
        <Reveal variant="scale" duration={1}>
          <div className="relative overflow-hidden rounded-3xl border border-accent-500/25 bg-accent-500/8 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-2/3 -translate-x-1/2 rounded-full bg-accent-500/15 blur-[120px]" />

            <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3.5 py-1.5 text-xs font-medium text-accent-300">
              <Sparkles className="size-3.5" />
              Precio Founder durante el lanzamiento
            </span>

            <MaskReveal
              as="h2"
              lines={["Empieza a operar tu consultorio", "con todo en un solo lugar"]}
              className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tighter text-ink-50 sm:text-4xl lg:text-5xl"
            />

            <div className="mx-auto mt-5 max-w-xl overflow-hidden">
              <MaskReveal
                as="p"
                lines={[
                  "Crea tu cuenta y organiza pacientes, agenda, historia clínica y pagos desde el primer día, sin importar tu especialidad.",
                ]}
                className="text-ink-200"
                delay={0.05}
              />
            </div>

            <MaskReveal
              as="div"
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              stagger={0.1}
              delay={0.1}
              lines={[
                <Button key="signup" variant="default" asChild className="rounded-full">
                  <Link href="/sign-up">
                    Crear mi cuenta
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>,
                <Button key="pricing" variant="outline" asChild className="rounded-full">
                  <Link href="/#pricing" scroll={false}>Ver planes</Link>
                </Button>,
              ]}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
