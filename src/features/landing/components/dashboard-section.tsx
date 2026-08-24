import { DashboardMockup } from "./dashboard";
import { CreditCard, CalendarCheck, Users } from 'lucide-react';

export const DashboardSection = () => {
    return (
        <section id="dashboard" className="container-py relative">
            <div className="relative default-container container-px mx-auto">
                <div className="reveal mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-400/90">Tu panel</span>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-ink-50 sm:text-4xl lg:text-5xl">Toda tu operación, en una sola pantalla</h2>
                    <p className="mt-5 text-ink-200">
                        En un vistazo ves citas del día, ingresos y lo que necesita tu atención.
                        Ideal para consultorios de cualquier tamaño y especialidad.
                    </p>
                </div>

                <div className="relative mt-14 sm:mt-16">
                    <div className="pointer-events-none absolute -inset-x-6 -top-6 bottom-0 -z-10 rounded-[36px] bg-linear-to-b from-accent-500/15 to-transparent blur-3xl" />
                    <div className="mx-auto max-w-5xl">
                        <DashboardMockup />
                    </div>
                    {/* Floating chips */}
                    <div className="absolute left-[15%] top-[40%] hidden animate-float md:block">
                        <div className="backdrop-blur-sm flex items-center gap-2 rounded-xl px-3 py-2 shadow-xl">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
                                <CalendarCheck className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="text-[11px] font-semibold text-ink-50">Cita confirmada</p>
                                <p className="text-[10px] text-ink-300">09:00 · María F.</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-2 top-1/3 hidden animate-float md:block">
                        <div className="backdrop-blur-sm flex items-center gap-2 rounded-xl px-3 py-2 shadow-xl">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                                <CreditCard className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="text-[11px] font-semibold text-ink-50">Pago registrado</p>
                                <p className="text-[10px] text-ink-300">Abono · $150.000</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-4 bottom-[30%] hidden animate-float md:block lg:right-6">
                        <div className="backdrop-blur-sm flex items-center gap-2 rounded-xl px-3 py-2 shadow-xl">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                                <Users className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="text-[11px] font-semibold text-ink-50">Nuevo paciente</p>
                                <p className="text-[10px] text-ink-300">Ana Torres</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    );
}

export default DashboardSection;