'use client';

import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui";
import { amountFormat } from "@/utils";
import { cn } from "@/lib/utils";
import type { ITopServices } from "../../interfaces";

interface AppointmentsTopServicesChartPieProps {
    data?: ITopServices[];
    className?: string;
}

const CHART_PALETTE = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
];

export const AppointmentsTopServicesChartPie = ({ data, className }: AppointmentsTopServicesChartPieProps) => {
    const services = useMemo(
        () =>
            [...(data ?? [])]
                .sort((first, second) => second.count - first.count)
                .map((item, index) => ({
                    key: `service-${item.idService}`,
                    label: item.serviceName,
                    count: item.count,
                    color: CHART_PALETTE[index % CHART_PALETTE.length],
                })),
        [data],
    );

    const total = useMemo(() => services.reduce((accumulated, item) => accumulated + item.count, 0), [services]);

    const chartConfig = useMemo<ChartConfig>(() => {
        const config: ChartConfig = { count: { label: "Citas" } };
        services.forEach((item) => {
            config[item.key] = { label: item.label, color: item.color };
        });
        return config;
    }, [services]);

    const chartData = useMemo(
        () =>
            services.map((item) => ({
                key: item.key,
                label: item.label,
                count: item.count,
                fill: `var(--color-${item.key})`,
            })),
        [services],
    );

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    Servicios más solicitados
                </CardTitle>
                <CardDescription className="text-2xl font-semibold tracking-tight text-ink-50 tabular-nums">
                    {amountFormat(total)}
                </CardDescription>

                {services.length > 0 ? (
                    <CardAction>
                        <span className="rounded-full bg-ink-900 px-2.5 py-1 text-xs font-medium text-ink-300 ring-1 ring-inset ring-ink-750">
                            {`${services.length} ${services.length === 1 ? "servicio" : "servicios"}`}
                        </span>
                    </CardAction>
                ) : null}
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col gap-4 px-5 pb-5">
                {services.length ? (
                    <>
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-44 w-full max-w-44 shrink-0">
                            <PieChart accessibilityLayer={false}>
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            label="Servicio"
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

                                <Pie
                                    data={chartData}
                                    dataKey="count"
                                    nameKey="key"
                                    innerRadius="62%"
                                    outerRadius="100%"
                                    paddingAngle={2}
                                    strokeWidth={2}
                                    stroke="var(--color-ink-950)"
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;

                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-ink-50 text-lg font-semibold tabular-nums"
                                                    >
                                                        {services.length}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy ?? 0) + 20}
                                                        className="fill-ink-400 text-[11px]"
                                                    >
                                                        {services.length === 1 ? "servicio" : "servicios"}
                                                    </tspan>
                                                </text>
                                            );
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        <ul className="mt-auto flex flex-col gap-2.5">
                            {services.map((item) => (
                                <li key={item.key} className="flex items-center gap-3 text-xs">
                                    <span
                                        className="size-2 shrink-0 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="flex-1 truncate text-ink-300">{item.label}</span>
                                    <span className="text-ink-400 tabular-nums">
                                        {total > 0 ? `${Math.round((item.count / total) * 100)}%` : "0%"}
                                    </span>
                                    <span className="w-16 text-right font-medium text-ink-50 tabular-nums">
                                        {amountFormat(item.count)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-center text-xs text-ink-400">
                        Aún no hay servicios con citas para mostrar.
                    </div>
                )}
            </CardContent>

            <CardFooter className="mt-auto">
                <p className="text-xs text-ink-400">Servicios más solicitados del mes actual</p>
            </CardFooter>
        </Card>
    );
};
