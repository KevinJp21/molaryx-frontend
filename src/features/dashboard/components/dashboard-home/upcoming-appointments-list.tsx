'use client';

import { useMemo } from "react";
import { format, isSameDay, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Stethoscope, User } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { amountFormat } from "@/utils";
import { cn } from "@/lib/utils";
import {
    formatDuration,
    formatEventTime,
} from "../../modules/appointments/utils/format-time";
import {
    getAppointmentStatusColor,
    getAppointmentStatusLabel,
} from "../../modules/appointments/consts/appointment-status";
import type { IUpcoming } from "../../interfaces";

interface UpcomingAppointmentsListProps {
    data?: IUpcoming[];
    className?: string;
}

const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Hoy";
    if (isTomorrow(date)) return "Mañana";
    return format(date, "EEEE", { locale: es });
};

const getFullName = (name?: string | null, surname?: string | null) =>
    [name, surname].filter(Boolean).join(" ").trim();

export const UpcomingAppointmentsList = ({ data, className }: UpcomingAppointmentsListProps) => {
    const groupedAppointments = useMemo(() => {
        const sorted = [...(data ?? [])]
            .map((item) => ({
                ...item,
                start: parseISO(item.startAt),
                end: parseISO(item.endAt),
            }))
            .filter((item) => !Number.isNaN(item.start.getTime()) && !Number.isNaN(item.end.getTime()))
            .sort((first, second) => first.start.getTime() - second.start.getTime());

        const groups: {
            date: Date;
            appointments: typeof sorted;
        }[] = [];

        sorted.forEach((appointment) => {
            const day = startOfDay(appointment.start);
            const existing = groups.find((group) => isSameDay(group.date, day));
            if (existing) {
                existing.appointments.push(appointment);
                return;
            }
            groups.push({ date: day, appointments: [appointment] });
        });

        return groups;
    }, [data]);

    const total = useMemo(
        () => groupedAppointments.reduce((accumulated, group) => accumulated + group.appointments.length, 0),
        [groupedAppointments],
    );

    return (
        <Card className={cn("flex h-full flex-col", className)}>
            <CardHeader>
                <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-ink-600">
                    Próximas citas
                </CardTitle>
                <CardDescription className="text-2xl font-semibold tracking-tight text-ink-950 tabular-nums">
                    {amountFormat(total)}
                </CardDescription>

                {total > 0 ? (
                    <CardAction>
                        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-inset ring-ink-250">
                            {`${amountFormat(groupedAppointments.length)} ${groupedAppointments.length === 1 ? "día" : "días"}`}
                        </span>
                    </CardAction>
                ) : null}
            </CardHeader>

            <CardContent className="min-h-0 flex-1 px-0 pb-0">
                {groupedAppointments.length ? (
                    <div className="max-h-105 overflow-y-auto px-5 pb-5">
                        {groupedAppointments.map((group) => (
                            <div key={group.date.toISOString()} className="relative">
                                <div className="sticky top-0 z-10 border-b border-ink-200 bg-ink-50/95 py-3 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "flex size-14 flex-col items-center justify-center rounded-2xl transition-all",
                                                isToday(group.date)
                                                    ? "bg-accent-500 text-white shadow-lg shadow-accent-500/30"
                                                    : "bg-ink-100 text-ink-950 ring-1 ring-ink-250",
                                            )}
                                        >
                                            <span className="text-xl font-bold leading-none">
                                                {format(group.date, "d")}
                                            </span>
                                            <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
                                                {format(group.date, "MMM", { locale: es })}
                                            </span>
                                        </div>

                                        <div className="flex flex-col">
                                            <span
                                                className={cn(
                                                    "text-base font-semibold capitalize",
                                                    isToday(group.date) ? "text-accent-600" : "text-ink-950",
                                                )}
                                            >
                                                {getDateLabel(group.date)}
                                            </span>
                                            <span className="text-xs text-ink-600">
                                                {group.appointments.length}{" "}
                                                {group.appointments.length === 1 ? "cita" : "citas"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 py-3">
                                    {group.appointments.map((appointment) => {
                                        const statusId = Number(appointment.idAppointmentStatus);
                                        const statusColor = getAppointmentStatusColor(statusId);
                                        const statusLabel = getAppointmentStatusLabel(
                                            statusId,
                                            appointment.appointmentStatus,
                                        );
                                        const patientName = getFullName(
                                            appointment.patientName,
                                            appointment.patientSurname,
                                        );
                                        const professionalName = getFullName(
                                            appointment.professionalName,
                                            appointment.professionalSurname,
                                        );

                                        return (
                                            <article
                                                key={appointment.idAppointment}
                                                className="relative flex gap-3 rounded-2xl border border-ink-200 bg-ink-50 p-3.5"
                                            >
                                                <span
                                                    className="absolute top-3 bottom-3 left-0 w-1 rounded-full"
                                                    style={{ backgroundColor: statusColor }}
                                                />

                                                <div className="flex min-w-16 flex-col items-center pl-2">
                                                    <span className="text-sm font-semibold text-ink-950">
                                                        {format(appointment.start, "h:mm")}
                                                    </span>
                                                    <span className="text-[10px] uppercase text-ink-600">
                                                        {format(appointment.start, "a", { locale: es }).replace(/\./g, "")}
                                                    </span>
                                                    <span className="my-1 h-3 w-px bg-ink-300" />
                                                    <span className="text-[10px] font-medium text-ink-600/80">
                                                        {formatDuration(appointment.start, appointment.end)}
                                                    </span>
                                                </div>

                                                <div className="min-w-0 flex-1 space-y-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="line-clamp-1 text-sm font-semibold text-ink-950">
                                                            {patientName || "Paciente sin nombre"}
                                                        </h4>
                                                        <span
                                                            className="mt-1 size-2.5 shrink-0 rounded-full"
                                                            style={{ backgroundColor: statusColor }}
                                                        />
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                                        <span className="flex items-center gap-1.5 text-xs text-ink-600">
                                                            <Clock className="size-3.5 shrink-0" />
                                                            {formatEventTime(appointment.start)} -{" "}
                                                            {formatEventTime(appointment.end)}
                                                        </span>
                                                        {appointment.procedureNames ? (
                                                            <span className="flex items-center gap-1.5 text-xs text-ink-600">
                                                                <Stethoscope className="size-3.5 shrink-0" />
                                                                <span className="line-clamp-1">{appointment.procedureNames}</span>
                                                            </span>
                                                        ) : null}
                                                        {professionalName ? (
                                                            <span className="flex items-center gap-1.5 text-xs text-ink-600">
                                                                <User className="size-3.5 shrink-0" />
                                                                <span className="line-clamp-1">{professionalName}</span>
                                                            </span>
                                                        ) : null}
                                                        <span
                                                            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                                                            style={{
                                                                backgroundColor: `${statusColor}1f`,
                                                                color: statusColor,
                                                            }}
                                                        >
                                                            {statusLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-48 items-center justify-center px-5 pb-5 text-center text-xs text-ink-600">
                        No hay citas próximas por mostrar.
                    </div>
                )}
            </CardContent>

            <CardFooter className="mt-auto">
                <p className="text-xs text-ink-600">Agenda de próximas citas</p>
            </CardFooter>
        </Card>
    );
};
