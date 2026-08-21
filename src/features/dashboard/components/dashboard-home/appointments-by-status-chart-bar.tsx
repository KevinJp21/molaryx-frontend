'use client';

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis, type BarShapeProps } from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui";
import { amountFormat } from "@/utils";
import { cn } from "@/lib/utils";
import { getAppointmentStatusLabel } from "../../modules/appointments/consts/appointment-status";
import type { IByStatus } from "../../interfaces";

interface AppointmentsByStatusChartBarProps {
    data?: IByStatus[];
    className?: string;
}

const CHART_PALETTE = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
];

export const AppointmentsByStatusChartBar = ({ data, className }: AppointmentsByStatusChartBarProps) => {
    const statuses = useMemo(
        () =>
            [...(data ?? [])]
                .sort((first, second) => second.count - first.count)
                .map((item, index) => {
                    const key = `status-${item.idAppointmentStatus}`;
                    const label = getAppointmentStatusLabel(item.idAppointmentStatus, item.appointmentStatus);
                    return {
                        key,
                        label,
                        shortLabel: label,
                        count: item.count,
                        color: CHART_PALETTE[index % CHART_PALETTE.length],
                    };
                }),
        [data],
    );

    const total = useMemo(() => statuses.reduce((accumulated, item) => accumulated + item.count, 0), [statuses]);

    const chartConfig = useMemo<ChartConfig>(() => {
        const config: ChartConfig = { count: { label: "Citas" } };
        statuses.forEach((item) => {
            config[item.key] = { label: item.label, color: item.color };
        });
        return config;
    }, [statuses]);

    const chartData = useMemo(
        () =>
            statuses.map((item) => ({
                key: item.key,
                label: item.label,
                shortLabel: item.shortLabel,
                count: item.count,
                fill: `var(--color-${item.key})`,
            })),
        [statuses],
    );

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    Citas por estado
                </CardTitle>
                <CardDescription className="text-2xl font-semibold tracking-tight text-ink-50 tabular-nums">
                    {amountFormat(total)}
                </CardDescription>

                {statuses.length > 0 ? (
                    <CardAction>
                        <span className="rounded-full bg-ink-900 px-2.5 py-1 text-xs font-medium text-ink-300 ring-1 ring-inset ring-ink-750">
                            {`${statuses.length} ${statuses.length === 1 ? "estado" : "estados"}`}
                        </span>
                    </CardAction>
                ) : null}
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col px-2 pb-4">
                {statuses.length ? (
                    <ChartContainer config={chartConfig} className="aspect-auto min-h-56 w-full flex-1">
                        <BarChart
                            accessibilityLayer={false}
                            data={chartData}
                            margin={{ left: 4, right: 12, top: 8 }}
                            barCategoryGap="14%"
                        >
                            <CartesianGrid vertical={false} strokeDasharray="4 4" />

                            <XAxis
                                dataKey="shortLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                interval={0}
                                tickFormatter={(value: string) =>
                                    value.length > 10 ? `${value.slice(0, 9)}…` : value
                                }
                            />

                            <YAxis
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                                width={36}
                                tickMargin={8}
                            />

                            <ChartTooltip
                                cursor={{ fill: "var(--color-ink-850)", opacity: 0.6 }}
                                content={
                                    <ChartTooltipContent
                                        label="Estado"
                                        nameKey="key"
                                        valueFormatter={(value) => amountFormat(Number(value))}
                                        secondaryText={(item) => {
                                            const count = Number(item.value ?? 0);
                                            const share = total > 0 ? Math.round((count / total) * 100) : 0;
                                            return `${share}% del total`;
                                        }}
                                    />
                                }
                            />

                            <Bar
                                dataKey="count"
                                radius={[10, 10, 4, 4]}
                                shape={(props: BarShapeProps) => (
                                    <Rectangle
                                        {...props}
                                        fill={props.payload?.fill ?? props.fill}
                                        radius={[10, 10, 4, 4]}
                                    />
                                )}
                            />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <div className="flex min-h-56 flex-1 items-center justify-center px-5 text-center text-xs text-ink-400">
                        Aún no hay citas registradas para mostrar por estado.
                    </div>
                )}
            </CardContent>

            <CardFooter className="mt-auto">
                <p className="text-xs text-ink-400">Distribución de citas del mes actual por estado</p>
            </CardFooter>
        </Card>
    );
};
