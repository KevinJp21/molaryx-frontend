import {
    CalendarDays,
    Users,
    Search,
    Bell,
    ChevronRight,
    Clock,
    TrendingUp,
    CheckCircle2,
} from 'lucide-react';

import {
    NAV_ITEMS,
    APPOINTMENTS,
    RECENT_PATIENTS,
    STATUS_STYLES,
    CALENDAR_DAYS,
    TODAY,
    MARKED,
    DASHBOARD_METRICS,
    DASHBOARD_REVENUE,
} from "../../const";

export function DashboardMockup({ compact = false }: { compact?: boolean }) {
    return (
        <div className="mockup-dark w-full overflow-hidden rounded-2xl border border-ink-800/10 bg-ink-100 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
            {/* Top bar */}
            <div className="flex items-center gap-3 border-b border-ink-800/6 bg-ink-150/80 px-4 py-3">
                <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
                </div>
                <div className="mx-auto hidden items-center gap-2 rounded-md border border-ink-800/6 bg-ink-100/80 px-3 py-1 text-[11px] text-ink-700 sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    app.molaryx.com/inicio
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                {!compact && (
                    <aside className="hidden w-45 shrink-0 flex-col gap-1 border-r border-ink-800/6 bg-ink-100/60 p-3 md:flex">
                        <div className="mb-3 flex items-center gap-2 px-2 py-1.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-200 ring-1 ring-white/10">
                                <span className="text-[13px] font-bold text-accent-400">M</span>
                            </span>
                            <span className="text-sm font-semibold text-ink-950">Molaryx</span>
                        </div>
                        {NAV_ITEMS.map((item) => (
                            <div
                                key={item.label}
                                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] ${item.active
                                        ? 'bg-accent-500/10 text-accent-300 ring-1 ring-inset ring-accent-500/20'
                                        : 'text-ink-700 hover:bg-white/3'
                                    }`}
                            >
                                <item.icon className="h-4 w-4" strokeWidth={1.75} />
                                {item.label}
                            </div>
                        ))}
                        <div className="mt-auto rounded-xl border border-ink-800/6 bg-ink-150 p-3">
                            <p className="text-[11px] font-medium text-ink-900">Professional</p>
                            <p className="mt-0.5 text-[10px] text-ink-700">Renueva en 18 días</p>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-300">
                                <div className="h-full w-2/3 rounded-full bg-accent-500" />
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main */}
                <div className="min-w-0 flex-1 bg-ink-50/40 p-4 sm:p-5">
                    {/* Header row */}
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[11px] text-ink-700">Buenos días, Dra. Salinas</p>
                            <h3 className="text-base font-semibold text-ink-950 sm:text-lg">Resumen de hoy</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="hidden items-center gap-2 rounded-lg border border-ink-800/6 bg-ink-150 px-2.5 py-1.5 text-ink-700 sm:flex">
                                <Search className="h-3.5 w-3.5" />
                                <span className="text-[11px]">Buscar</span>
                            </div>
                            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-ink-800/6 bg-ink-150 text-ink-800">
                                <Bell className="h-4 w-4" />
                                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-500" />
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-accent-400 to-coral-500 text-[11px] font-semibold text-ink-50">
                                DS
                            </span>
                        </div>
                    </div>

                    {/* Metric cards */}
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {DASHBOARD_METRICS.map((m) => (
                            <div key={m.label} className="rounded-xl border border-ink-800/6 bg-ink-150/70 p-3">
                                <div className="flex items-center justify-between">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/4 text-ink-800">
                                        <m.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                                    </span>
                                    <span className={`text-[10px] font-semibold ${m.tone}`}>{m.delta}</span>
                                </div>
                                <p className="mt-2.5 text-lg font-semibold text-ink-950">{m.value}</p>
                                <p className="text-[10px] text-ink-700">{m.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Two-column body */}
                    <div className="mt-4 grid gap-3 lg:grid-cols-5">
                        {/* Appointments */}
                        <div className="rounded-xl border border-ink-800/6 bg-ink-150/70 p-4 lg:col-span-3">
                            <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-ink-950">Próximas consultas</h4>
                                <span className="flex items-center gap-1 text-[11px] text-accent-300">
                                    Ver agenda <ChevronRight className="h-3 w-3" />
                                </span>
                            </div>
                            <div className="space-y-2">
                                {APPOINTMENTS.map((a) => (
                                    <div
                                        key={a.patient}
                                        className="flex items-center gap-3 rounded-lg border border-ink-800/4 bg-ink-100/50 px-3 py-2.5"
                                    >
                                        <div className="flex w-12 shrink-0 flex-col items-center">
                                            <span className="text-xs font-semibold text-ink-950">{a.time}</span>
                                            <span className="flex items-center gap-0.5 text-[9px] text-ink-600">
                                                <Clock className="h-2.5 w-2.5" /> 45m
                                            </span>
                                        </div>
                                        <div className="h-8 w-px bg-white/6" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-medium text-ink-950">{a.patient}</p>
                                            <p className="truncate text-[10px] text-ink-700">{a.service}</p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ring-1 ring-inset ${STATUS_STYLES[a.status]}`}
                                        >
                                            {a.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right column: revenue + patients */}
                        <div className="space-y-3 lg:col-span-2">
                            <div className="rounded-xl border border-ink-800/6 bg-ink-150/70 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-ink-950">Ingresos</h4>
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-300">
                                        <TrendingUp className="h-3 w-3" /> {DASHBOARD_REVENUE.delta}
                                    </span>
                                </div>
                                <p className="text-xl font-semibold text-ink-950">{DASHBOARD_REVENUE.total}</p>
                                <div className="mt-3 flex h-16 min-w-0 items-end gap-0.5 sm:gap-1.5">
                                    {DASHBOARD_REVENUE.chart.map((h, i) => (
                                        <div
                                            key={i}
                                            className="min-w-0 flex-1 rounded-t bg-linear-to-t from-accent-500/30 to-accent-400/80"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-ink-800/6 bg-ink-150/70 p-4">
                                <h4 className="mb-3 text-sm font-semibold text-ink-950">Pacientes recientes</h4>
                                <div className="space-y-2.5">
                                    {RECENT_PATIENTS.map((p) => (
                                        <div key={p.name} className="flex items-center gap-2.5">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-300 text-[10px] font-semibold text-ink-900">
                                                {p.initials}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium text-ink-950">{p.name}</p>
                                                <p className="truncate text-[10px] text-ink-700">{p.note}</p>
                                            </div>
                                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400/70" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar strip */}
                    <div className="mt-3 rounded-xl border border-ink-800/6 bg-ink-150/70 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-ink-950">Agenda · Octubre</h4>
                            <div className="flex items-center gap-1 text-ink-700">
                                <span className="rounded-md border border-ink-800/6 px-1.5 py-0.5 text-[10px]">‹</span>
                                <span className="rounded-md border border-ink-800/6 px-1.5 py-0.5 text-[10px]">›</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                                <span key={d} className="text-[9px] font-medium uppercase text-ink-600">{d}</span>
                            ))}
                            {CALENDAR_DAYS.map((day, i) => {
                                if (day === null) return <span key={i} />;
                                const isToday = day === TODAY;
                                const isMarked = MARKED.has(day);
                                return (
                                    <div
                                        key={i}
                                        className={`relative flex h-7 items-center justify-center rounded-md text-[10px] ${isToday
                                                ? 'bg-accent-500 font-semibold text-ink-50'
                                                : isMarked
                                                    ? 'bg-white/5 font-medium text-ink-900'
                                                    : 'text-ink-700'
                                            }`}
                                    >
                                        {day}
                                        {isMarked && !isToday && (
                                            <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-accent-400" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
