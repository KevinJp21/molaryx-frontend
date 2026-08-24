import { Sparkles, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components";
import Link from "next/link";

export const HeroSection = () => {
    return (
        <section className="relative flex min-h-dvh w-full items-center justify-center container-py pt-28 sm:pt-32">
            <video
                autoPlay
                muted
                loop
                playsInline
                poster="/images/hero-poster.webp"
                className="absolute inset-0 object-cover w-full h-full"
            >
                <source src="https://ifamr8jwxlstayho.public.blob.vercel-storage.com/hero-video.webm" type="video/webm" />
                <source src="https://ifamr8jwxlstayho.public.blob.vercel-storage.com/hero-video-optimized.mp4" type="video/mp4" />
            </video>
            <div className="relative default-container container-px mx-auto">
                <div className="flex justify-center">
                    <span className="inline-flex items-center text-center gap-2 rounded-full border border-white/8 px-3.5 py-1.5 text-xs font-medium text-ink-200 backdrop-blur-sm">
                        <Sparkles className="size-3.5 text-accent-400" />
                        Para consultorios de cualquier especialidad
                    </span>
                </div>
                <div className="flex flex-col justify-center mt-7 text-center">
                    <h1 className="flex flex-col text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tighter">
                        <span>Gestiona tu consultorio.</span>
                        <span className="gradient-text">
                            Simplifica tu día.
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base text-ink-200 sm:text-lg">
                        Pacientes, historia clínica, citas, procedimientos, tratamientos y pagos
                        en una sola plataforma. Organiza la operación de tu consultorio sin importar tu especialidad.
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row mt-9">
                    <Button variant="default" asChild className="rounded-full">
                        <Link href="/sign-up">
                            <ArrowRight className="size-4" />
                            Comenzar ahora
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="rounded-full">
                        <Link href="/#features">
                            <Play className="size-4 text-accent-400" />
                            Ver funcionalidades
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
