import Link from "next/link";
import { Logo } from "@/components";
import { Check } from "lucide-react";
import { COMPANY_NAME } from "@/consts";

export default function AuthenticationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const highlights = [
        "Historia clínica y registros por paciente",
        "Pacientes, agenda, procedimientos y pagos en un solo lugar",
        "Pensado para cualquier tipo de consultorio",
    ];

    return (
        <div className="relative flex min-h-dvh flex-col bg-ink-950 text-ink-100 lg:flex-row">
            {/* Brand panel */}
            <div className="relative hidden overflow-hidden bg-ink-900 lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-12 xl:w-2/5">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-105 w-105 -translate-x-1/2 rounded-full bg-accent-500/25 opacity-50 blur-[130px]" />
                    <div className="absolute bottom-0 right-0 h-70 w-70 rounded-full bg-coral-500/15 opacity-50 blur-[120px]" />
                </div>

                <Link href="/" className="inline-block w-fit">
                    <Logo size={52} />
                </Link>

                <div className="max-w-sm">
                    <h2 className="text-3xl font-semibold leading-tight text-ink-50">
                        Tu consultorio,{" "}
                        <span className="gradient-text">más simple.</span>
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-ink-300">
                        Organiza pacientes, historia clínica, citas, procedimientos,
                        tratamientos y pagos desde una sola plataforma.
                    </p>

                    <ul className="mt-8 flex flex-col gap-3">
                        {highlights.map((h) => (
                            <li
                                key={h}
                                className="flex items-start gap-2.5 text-sm text-ink-200"
                            >
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-accent-300">
                                    <Check className="h-3 w-3" strokeWidth={2.5} />
                                </span>
                                {h}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-xs text-ink-500">
                    © {new Date().getFullYear()} {COMPANY_NAME}
                </p>
            </div>

            {/* Form Panel */}
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="container-px flex items-center justify-between py-6">
                    <Link href="/" className="lg:hidden">
                        <Logo size={42} layout="fixed" />
                    </Link>
                    <span className="hidden lg:block" />
                </div>

                <div className="flex flex-1 flex-col items-center px-4 pb-16 sm:px-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
