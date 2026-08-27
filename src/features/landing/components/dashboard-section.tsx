"use client";

import { useRef } from "react";
import { CreditCard, CalendarCheck, Users } from "lucide-react";
import { DashboardMockup } from "./dashboard";
import { SectionHeading } from "./motion";
import { gsap } from "./motion/gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "./motion/utils";

const CHIPS = [
    {
        icon: CalendarCheck,
        title: "Cita confirmada",
        detail: "09:00 · María F.",
        iconClass: "bg-accent-500/15 text-accent-300",
        position: "left-[15%] top-[40%]",
        distance: 90,
    },
    {
        icon: CreditCard,
        title: "Pago registrado",
        detail: "Abono · $150.000",
        iconClass: "bg-emerald-500/15 text-emerald-300",
        position: "-right-2 top-1/3",
        distance: 130,
    },
    {
        icon: Users,
        title: "Nuevo paciente",
        detail: "Ana Torres",
        iconClass: "bg-indigo-500/15 text-indigo-300",
        position: "-right-4 bottom-[30%] lg:right-6",
        distance: 60,
    },
] as const;

export const DashboardSection = () => {
    const stageRef = useRef<HTMLDivElement>(null);

    useIsomorphicLayoutEffect(() => {
        const stage = stageRef.current;
        if (!stage || prefersReducedMotion()) return;

        const context = gsap.context(() => {
            // El mockup se "abre" desde una inclinación mientras entra en pantalla.
            gsap.fromTo(
                "[data-dashboard-frame]",
                { rotateX: 18, scale: 0.9, y: 60 },
                {
                    rotateX: 0,
                    scale: 1,
                    y: 0,
                    ease: "none",
                    transformOrigin: "50% 100%",
                    scrollTrigger: {
                        trigger: stage,
                        start: "top 90%",
                        end: "top 30%",
                        scrub: true,
                    },
                }
            );

            gsap.utils.toArray<HTMLElement>("[data-dashboard-chip]").forEach((chip) => {
                const distance = Number(chip.dataset.distance ?? 80);

                gsap.fromTo(
                    chip,
                    { y: distance },
                    {
                        y: -distance,
                        ease: "none",
                        scrollTrigger: {
                            trigger: stage,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    }
                );

                gsap.set(chip, { opacity: 0 });
                gsap.to(chip, {
                    opacity: 1,
                    duration: 0.9,
                    ease: "power2.out",
                    scrollTrigger: { trigger: stage, start: "top 70%", once: true },
                });
            });
        }, stage);

        return () => context.revert();
    }, []);

    return (
        <section id="dashboard" className="container-py relative">
            <div className="relative default-container container-px mx-auto">
                <SectionHeading
                    eyebrow="Tu panel"
                    titleLines={["Toda tu operación,", "en una sola pantalla"]}
                    description="En un vistazo ves citas del día, ingresos y lo que necesita tu atención. Ideal para consultorios de cualquier tamaño y especialidad."
                />

                <div ref={stageRef} className="relative mt-14 sm:mt-16">
                    <div className="pointer-events-none absolute -inset-x-6 -top-6 bottom-0 -z-10 rounded-[36px] bg-linear-to-b from-accent-500/15 to-transparent blur-3xl" />

                    <div className="mx-auto max-w-5xl perspective-[1400px]">
                        <div data-dashboard-frame className="will-change-transform">
                            <DashboardMockup />
                        </div>
                    </div>

                    {CHIPS.map((chip) => (
                        <div
                            key={chip.title}
                            data-dashboard-chip
                            data-distance={chip.distance}
                            className={`absolute hidden md:block ${chip.position}`}
                        >
                            <div className="animate-float">
                                <div className="backdrop-blur-sm flex items-center gap-2 rounded-xl px-3 py-2 shadow-xl">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${chip.iconClass}`}
                                    >
                                        <chip.icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-[11px] font-semibold text-ink-50">
                                            {chip.title}
                                        </p>
                                        <p className="text-[10px] text-ink-300">{chip.detail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DashboardSection;
