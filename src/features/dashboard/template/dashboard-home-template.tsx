'use client';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getAppointmentsSummary, getPaymentsSummary, selectGetAppointmentsSummary, selectGetPaymentsSummary } from "@/store/dashboard/dashboard-slice";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { CustomCard, CustomCardSkeleton } from "@/components/global";
import { CalendarIcon, CreditCardIcon, WalletIcon } from "lucide-react";
import { currencyFormat } from "@/utils";
import { cn } from "@/lib/utils";
import { hasPermissionCode } from "../utils";
import { RevenueOverTimeChartArea, PaymentsMethodsChartPie, AppointmentsByStatusChartBar, AppointmentsTopServicesChartPie, UpcomingAppointmentsList } from "../components";

export const DashboardHomeTemplate = () => {
    const dispatch = useAppDispatch();
    const payments = useAppSelector(selectGetPaymentsSummary);
    const appointments = useAppSelector(selectGetAppointmentsSummary);
    const { data: userData } = useAppSelector(selectGetUserData);
    const isLoading = payments.status === "loading" || appointments.status === "loading";

    const canViewPayments = hasPermissionCode(
        userData?.permissions,
        "PAYMENTS",
        "GET_PAYMENTS");

    useEffect(() => {
        dispatch(getPaymentsSummary());
        dispatch(getAppointmentsSummary());
    }, [dispatch]);
    return (
        <>
            <section
                className={cn(
                    "grid grid-cols-1 gap-4",
                    canViewPayments ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-1",
                )}
            >
                {isLoading ? (
                    <CustomCardSkeleton count={canViewPayments ? 3 : 1} />
                ) :
                    <>
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
                        <CustomCard
                            title="Citas"
                            icon={<CalendarIcon className="h-4 w-4" />}
                            mainValue={appointments.data?.todayCount ?? 0}
                            color="coral"
                            footerText="Citas hoy"
                        />
                    </>
                }
            </section>
            {canViewPayments && !isLoading ? (
                <section className="mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
                    <RevenueOverTimeChartArea data={payments.data?.revenueOverTime} />
                    <PaymentsMethodsChartPie data={payments.data?.paymentMethods} />
                </section>
            ) : null}
            {!isLoading ? (
                <>
                    <section className="mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
                        <AppointmentsByStatusChartBar data={appointments.data?.byStatus} />
                        <AppointmentsTopServicesChartPie data={appointments.data?.topServices} />
                    </section>
                    <section className="mt-4">
                        <UpcomingAppointmentsList data={appointments.data?.upcoming} />
                    </section>
                </>
            ) : null}
        </>
    );
};