import { Sparkles, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components";
export const Hero = () => {
    return (
        <section className="relative min-h-dvh w-full pt-28 sm:pt-36 lg:pt-44">
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
                        La plataforma todo-en-uno para consultorios
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
                        Molaryx te ayuda a organizar pacientes, citas, servicios, pagos y la operación completa de tu consultorio desde un solo lugar.
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row mt-9">
                    <Button variant="default">
                        Comenzar Ahora
                        <ArrowRight className="size-4" />
                    </Button>
                    <Button variant="outline">
                        <Play className="size-4 text-accent-400" />
                        Conocer Molaryx
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;