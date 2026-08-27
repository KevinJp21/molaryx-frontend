'use client';

import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui";
import { amountFormat, currencyFormat } from "@/utils";
import { cn } from "@/lib/utils";
import type { IPaymentsMethods } from "../../interfaces";

interface PaymentsMethodsChartPieProps {
    data?: IPaymentsMethods[];
    className?: string;
}

const CHART_PALETTE = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
];

export const PaymentsMethodsChartPie = ({ data, className }: PaymentsMethodsChartPieProps) => {
    const methods = useMemo(
        () =>
            [...(data ?? [])]
                .sort((first, second) => second.amount - first.amount)
                .map((item, index) => ({
                    key: `method-${item.idPaymentMethod}`,
                    label: item.paymentMethod,
                    amount: item.amount,
                    paymentCount: item.paymentCount,
                    color: CHART_PALETTE[index % CHART_PALETTE.length],
                })),
        [data],
    );

    const total = useMemo(() => methods.reduce((accumulated, item) => accumulated + item.amount, 0), [methods]);
    const totalPayments = useMemo(
        () => methods.reduce((accumulated, item) => accumulated + item.paymentCount, 0),
        [methods],
    );

    const chartConfig = useMemo<ChartConfig>(() => {
        const config: ChartConfig = { amount: { label: "Monto" } };
        methods.forEach((item) => {
            config[item.key] = { label: item.label, color: item.color };
        });
        return config;
    }, [methods]);

    const chartData = useMemo(
        () =>
            methods.map((item) => ({
                key: item.key,
                label: item.label,
                amount: item.amount,
                paymentCount: item.paymentCount,
                fill: `var(--color-${item.key})`,
            })),
        [methods],
    );

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-ink-600">
                    Métodos de pago
                </CardTitle>
                <CardDescription className="text-2xl font-semibold tracking-tight text-ink-950 tabular-nums">
                    {currencyFormat(total, 0)}
                </CardDescription>

                {totalPayments > 0 ? (
                    <CardAction>
                        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-inset ring-ink-250">
                            {`${amountFormat(totalPayments)} ${totalPayments === 1 ? "pago" : "pagos"}`}
                        </span>
                    </CardAction>
                ) : null}
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col gap-4 px-5 pb-5">
                {methods.length ? (
                    <>
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-44 w-full max-w-44 shrink-0">
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            label="Método"
                                            nameKey="key"
                                            valueFormatter={(value) => currencyFormat(Number(value), 0)}
                                            secondaryText={(item) => {
                                                const amount = Number(item.value ?? 0);
                                                const paymentCount = Number(item.payload?.paymentCount ?? 0);
                                                const share = total > 0 ? Math.round((amount / total) * 100) : 0;
                                                return `${share}% · ${amountFormat(paymentCount)} ${paymentCount === 1 ? "pago" : "pagos"}`;
                                            }}
                                        />
                                    }
                                />

                                <Pie
                                    data={chartData}
                                    dataKey="amount"
                                    nameKey="key"
                                    innerRadius="62%"
                                    outerRadius="100%"
                                    paddingAngle={2}
                                    strokeWidth={2}
                                    stroke="var(--color-ink-50)"
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;

                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-ink-950 text-lg font-semibold tabular-nums"
                                                    >
                                                        {methods.length}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy ?? 0) + 20}
                                                        className="fill-ink-600 text-[11px]"
                                                    >
                                                        {methods.length === 1 ? "método" : "métodos"}
                                                    </tspan>
                                                </text>
                                            );
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        <ul className="mt-auto flex flex-col gap-2.5">
                            {methods.map((item) => (
                                <li key={item.key} className="flex items-center gap-3 text-xs">
                                    <span
                                        className="size-2 shrink-0 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="flex-1 truncate text-ink-700">{item.label}</span>
                                    <span className="text-ink-600 tabular-nums">
                                        {total > 0 ? `${Math.round((item.amount / total) * 100)}%` : "0%"}
                                    </span>
                                    <span className="w-24 text-right font-medium text-ink-950 tabular-nums">
                                        {currencyFormat(item.amount, 0)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-center text-xs text-ink-600">
                        Aún no hay pagos registrados para distribuir por método.
                    </div>
                )}
            </CardContent>

            <CardFooter className="mt-auto">
                <p className="text-xs text-ink-600">Distribución de ingresos del mes actual por método de pago</p>
            </CardFooter>
        </Card>
    );
};
