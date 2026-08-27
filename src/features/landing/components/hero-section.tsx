"use client";

import { useRef } from "react";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components";
import Link from "next/link";
import { gsap } from "./motion/gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "./motion/utils";

export const HeroSection = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useIsomorphicLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section || prefersReducedMotion()) return;

        const context = gsap.context(() => {
            const intro = gsap.timeline({
                defaults: { ease: "expo.out", duration: 1.1, clearProps: "all" },
            });

            gsap.set("[data-hero-badge]", { y: 18, opacity: 0 });
            gsap.set("[data-hero-line]", { yPercent: 118 });
            gsap.set("[data-hero-copy]", { yPercent: 118 });
            gsap.set("[data-hero-action]", { yPercent: 118 });

            intro
                .to("[data-hero-badge]", { y: 0, opacity: 1, duration: 0.8 })
                .to("[data-hero-line]", { yPercent: 0, stagger: 0.1 }, "-=0.5")
                .to("[data-hero-copy]", { yPercent: 0, duration: 1.1 }, "-=0.75")
                .to("[data-hero-action]", { yPercent: 0, stagger: 0.1 }, "-=0.85");

            gsap.fromTo(
                "[data-hero-video]",
                { scale: 1.14 },
                { scale: 1, duration: 2.2, ease: "power2.out" }
            );

            // El video se desplaza más lento que el contenido al salir del hero.
            gsap.to("[data-hero-video]", {
                yPercent: 12,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, section);

        return () => context.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden container-py pt-28 sm:pt-32"
        >
            <video
                data-hero-video
                autoPlay
                muted
                loop
                playsInline
                poster="/images/hero-poster.webp"
                className="absolute inset-0 object-cover w-full h-full will-change-transform"
            >
                <source src="https://ifamr8jwxlstayho.public.blob.vercel-storage.com/hero-video.webm" type="video/webm" />
                <source src="https://ifamr8jwxlstayho.public.blob.vercel-storage.com/hero-video-optimized.mp4" type="video/mp4" />
            </video>
            <div className="relative default-container container-px mx-auto">
                <div className="flex justify-center">
                    <span
                        data-hero-badge
                        className="inline-flex items-center text-center gap-2 rounded-full border border-ink-200/8 px-3.5 py-1.5 text-xs font-medium text-ink-200 backdrop-blur-sm"
                    >
                        <Sparkles className="size-3.5 text-accent-400" />
                        Para consultorios de cualquier especialidad
                    </span>
                </div>
                <div className="flex flex-col justify-center mt-7 text-center">
                    <h1 className="flex flex-col text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tighter">
                        <span className="block overflow-hidden pb-[0.12em] mb-[-0.12em]">
                            <span data-hero-line className="block will-change-transform">
                                Gestiona tu consultorio.
                            </span>
                        </span>
                        <span className="block overflow-hidden pb-[0.12em] mb-[-0.12em]">
                            <span data-hero-line className="block will-change-transform gradient-text">
                                Simplifica tu día.
                            </span>
                        </span>
                    </h1>
                    <div className="mx-auto mt-6 max-w-2xl overflow-hidden">
                        <p
                            data-hero-copy
                            className="will-change-transform text-base text-ink-200 sm:text-lg"
                        >
                            Pacientes, historia clínica, citas, procedimientos, tratamientos y pagos
                            en una sola plataforma. Organiza la operación de tu consultorio sin importar tu especialidad.
                        </p>
                    </div>
                </div>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <div className="overflow-hidden">
                        <div data-hero-action className="will-change-transform">
                            <Button variant="default" asChild className="rounded-full">
                                <Link href="/sign-up">
                                    <ArrowRight className="size-4" />
                                    Comenzar ahora
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <div data-hero-action className="will-change-transform">
                            <Button variant="outline" asChild className="rounded-full">
                                <Link href="/#features" scroll={false}>
                                    <Play className="size-4 text-accent-400" />
                                    Ver funcionalidades
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
