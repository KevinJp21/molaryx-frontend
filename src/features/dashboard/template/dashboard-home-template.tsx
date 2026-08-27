'use client';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getAppointmentsSummary, getPaymentsSummary, selectGetAppointmentsSummary, selectGetPaymentsSummary } from "@/store/dashboard/dashboard-slice";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { CustomCard, CustomCardSkeleton, ErrorMessage } from "@/components/global";
import { CalendarIcon, CreditCardIcon, WalletIcon } from "lucide-react";
import { currencyFormat } from "@/utils";
import { cn } from "@/lib/utils";
import { checkCanView } from "../utils";
import { PERMISSION_MODULES } from "../consts";
import { RevenueOverTimeChartArea, PaymentsMethodsChartPie, AppointmentsByStatusChartBar, AppointmentsTopProceduresChartPie, UpcomingAppointmentsList, DashboardHomeSkeleton } from "../components";

export const DashboardHomeTemplate = () => {
    const dispatch = useAppDispatch();
    const payments = useAppSelector(selectGetPaymentsSummary);
    const appointments = useAppSelector(selectGetAppointmentsSummary);
    const { data: userData } = useAppSelector(selectGetUserData);

    const canViewPayments = checkCanView(
        userData?.permissions,
        PERMISSION_MODULES.PAYMENTS,
    );
    const canViewAppointments = checkCanView(
        userData?.permissions,
        PERMISSION_MODULES.APPOINTMENTS,
    );
    const isLoading =
        (canViewAppointments && appointments.status === "loading") ||
        (canViewPayments && payments.status === "loading");

    const paymentsFailed = canViewPayments && payments.status === "error";
    const appointmentsFailed = canViewAppointments && appointments.status === "error";
    const hasError = paymentsFailed || appointmentsFailed;

    const errorDetail = [
        ...new Set(
            [
                paymentsFailed ? payments.message : null,
                appointmentsFailed ? appointments.message : null,
            ].filter(Boolean),
        ),
    ].join(" · ");

    useEffect(() => {
        if (canViewPayments) {
            dispatch(getPaymentsSummary());
        }
        if (canViewAppointments) {
            dispatch(getAppointmentsSummary());
        }
    }, [canViewPayments, canViewAppointments, dispatch]);

    return (
        <>
            <section className="mb-4">
                <h1 className="text-xl font-medium text-ink-950">Inicio</h1>
            </section>

            {isLoading ? (
                <>
                    <section
                        className={cn(
                            "grid grid-cols-1 gap-4",
                            canViewPayments && canViewAppointments
                                ? "md:grid-cols-2 lg:grid-cols-3"
                                : canViewPayments || canViewAppointments
                                  ? "md:grid-cols-1"
                                  : "md:grid-cols-1",
                        )}
                    >
                        <CustomCardSkeleton
                            count={
                                (canViewPayments ? 2 : 0) + (canViewAppointments ? 1 : 0) || 1
                            }
                        />
                    </section>
                    <DashboardHomeSkeleton
                        showPaymentsCharts={canViewPayments}
                        showAppointmentsCharts={canViewAppointments}
                    />
                </>
            ) : hasError ? (
                <ErrorMessage
                    message="No se pudo cargar el resumen del dashboard"
                    error={errorDetail || undefined}
                />
            ) : (
                <>
                    <section
                        className={cn(
                            "grid grid-cols-1 gap-4",
                            canViewPayments && canViewAppointments
                                ? "md:grid-cols-2 lg:grid-cols-3"
                                : canViewPayments
                                  ? "md:grid-cols-2"
                                  : canViewAppointments
                                    ? "md:grid-cols-1"
                                  : "md:grid-cols-1",
                        )}
                    >
                        {canViewPayments && (
                            <>
                                <CustomCard
                                    title="Ingresos"
                                    icon={<CreditCardIcon className="h-4 w-4" />}
                                    mainValue={currencyFormat(payments.data?.currentMonthRevenue ?? 0, 0)}
                                    footerText="Ingresos del mes actual"
                                />
                                <CustomCard
                                    title="Saldo pendiente"
                                    icon={<WalletIcon className="h-4 w-4" />}
                                    mainValue={currencyFormat(payments.data?.outstandingBalance ?? 0, 0)}
                                    color="yellow"
                                    footerText="Deuda global del consultorio"
                                />
                            </>
                        )}
                        {canViewAppointments && (
                            <CustomCard
                                title="Citas"
                                icon={<CalendarIcon className="h-4 w-4" />}
                                mainValue={appointments.data?.todayCount ?? 0}
                                color="coral"
                                footerText="Citas hoy"
                            />
                        )}
                    </section>

                    {canViewPayments ? (
                        <section className="mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
                            <RevenueOverTimeChartArea data={payments.data?.revenueOverTime} />
                            <PaymentsMethodsChartPie data={payments.data?.paymentMethods} />
                        </section>
                    ) : null}

                    {canViewAppointments ? (
                        <>
                            <section className="mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
                                <AppointmentsByStatusChartBar data={appointments.data?.byStatus} />
                                <AppointmentsTopProceduresChartPie data={appointments.data?.topProcedures} />
                            </section>

                            <section className="mt-4 flex-1">
                                <UpcomingAppointmentsList data={appointments.data?.upcoming} />
                            </section>
                        </>
                    ) : null}
                </>
            )}
        </>
    );
};
