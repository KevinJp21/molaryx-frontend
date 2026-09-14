'use client';

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui";
import { currencyCompactFormat, currencyFormat } from "@/utils";
import { cn } from "@/lib/utils";
import type { IRevenueOverTime } from "../../interfaces";

interface RevenueOverTimeChartAreaProps {
    data?: IRevenueOverTime[];
    className?: string;
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const chartConfig = {
    revenue: {
        label: "Ingresos",
        color: "var(--color-chart-1)",
    },
} satisfies ChartConfig;

export const RevenueOverTimeChartArea = ({ data, className }: RevenueOverTimeChartAreaProps) => {
    const chartData = useMemo(
        () =>
            (data ?? []).map((item) => ({
                label: `${MONTH_LABELS[item.month - 1] ?? item.month} ${item.year}`,
                shortLabel: MONTH_LABELS[item.month - 1] ?? `${item.month}`,
                revenue: item.revenue,
            })),
        [data],
    );

    const total = useMemo(() => chartData.reduce((accumulated, item) => accumulated + item.revenue, 0), [chartData]);

    const trend = useMemo(() => {
        if (chartData.length < 2) return null;
        const previous = chartData[chartData.length - 2].revenue;
        const current = chartData[chartData.length - 1].revenue;
        if (previous === 0) return null;
        return ((current - previous) / previous) * 100;
    }, [chartData]);

    const isPositiveTrend = (trend ?? 0) >= 0;
    const rangeLabel = chartData.length
        ? `${chartData[0].label} — ${chartData[chartData.length - 1].label}`
        : "Sin registros disponibles";

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-ink-600">
                    Ingresos de los ultimos 6 meses
                </CardTitle>
                <CardDescription className="text-2xl font-semibold tracking-tight text-ink-950 tabular-nums">
                    {currencyFormat(total, 0)}
                </CardDescription>

                {trend !== null ? (
                    <CardAction>
                        <span
                            className={cn(
                                "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                                isPositiveTrend
                                    ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                                    : "bg-coral-500/10 text-coral-600 ring-coral-500/20",
                            )}
                        >
                            {isPositiveTrend ? (
                                <TrendingUpIcon className="size-3.5" />
                            ) : (
                                <TrendingDownIcon className="size-3.5" />
                            )}
                            {`${isPositiveTrend ? "+" : ""}${trend.toFixed(1)}%`}
                        </span>
                    </CardAction>
                ) : null}
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col px-2 pb-4">
                {chartData.length ? (
                    <ChartContainer config={chartConfig} className="aspect-auto min-h-56 w-full flex-1">
                        <AreaChart accessibilityLayer data={chartData} margin={{ left: 4, right: 12, top: 8 }}>
                            <defs>
                                <linearGradient id="molaryx-revenue-fill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="4 4" />

                            <XAxis
                                dataKey="shortLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                minTickGap={8}
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={64}
                                tickMargin={8}
                                tickFormatter={(value: number) => currencyCompactFormat(value).replace(" COP", "")}
                            />

                            <ChartTooltip
                                cursor={{ strokeDasharray: "4 4" }}
                                content={
                                    <ChartTooltipContent
                                        labelKey="label"
                                        labelFormatter={(_, payload) =>
                                            payload?.[0]?.payload?.label ?? ""
                                        }
                                        valueFormatter={(value) => currencyFormat(Number(value), 0)}
                                    />
                                }
                            />

                            <Area
                                dataKey="revenue"
                                type="monotone"
                                fill="url(#molaryx-revenue-fill)"
                                stroke="var(--color-revenue)"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{
                                    r: 4,
                                    strokeWidth: 2,
                                    stroke: "var(--color-ink-50)",
                                    fill: "var(--color-revenue)",
                                }}
                            />
                        </AreaChart>
                    </ChartContainer>
                ) : (
                    <div className="flex min-h-56 flex-1 items-center justify-center px-5 text-center text-xs text-ink-600">
                        Aún no hay ingresos registrados para mostrar la tendencia.
                    </div>
                )}
            </CardContent>

            <CardFooter className="mt-auto">
                <p className="text-xs text-ink-600">{rangeLabel}</p>
            </CardFooter>
        </Card>
    );
};
