import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardHomeSkeletonProps {
    showPaymentsCharts?: boolean;
    showAppointmentsCharts?: boolean;
    className?: string;
}

const ChartCardSkeleton = ({ variant = "area" }: { variant?: "area" | "pie" | "bar" }) => (
    <Card className="h-full">
        <CardHeader>
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="mt-2 h-7 w-36" />
            <div data-slot="card-action">
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col px-5 pb-5">
            {variant === "pie" ? (
                <div className="flex flex-1 flex-col gap-4">
                    <Skeleton className="mx-auto size-44 rounded-full" />
                    <div className="mt-auto space-y-2.5">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <Skeleton className="size-2 rounded-full" />
                                <Skeleton className="h-3 flex-1" />
                                <Skeleton className="h-3 w-10" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex min-h-56 flex-1 flex-col justify-end gap-3">
                    <div className="flex flex-1 items-end gap-3 px-1">
                        {Array.from({ length: variant === "bar" ? 4 : 6 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-full rounded-md"
                                style={{ height: `${36 + ((index * 17) % 48)}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between gap-2">
                        {Array.from({ length: variant === "bar" ? 4 : 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-2.5 w-10" />
                        ))}
                    </div>
                </div>
            )}
        </CardContent>

        <CardFooter>
            <Skeleton className="h-3 w-48" />
        </CardFooter>
    </Card>
);

const UpcomingListSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="mt-2 h-7 w-16" />
            <div data-slot="card-action">
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </CardHeader>

        <CardContent className="space-y-5 px-5 pb-5">
            {Array.from({ length: 2 }).map((_, groupIndex) => (
                <div key={groupIndex} className="space-y-3">
                    <div className="flex items-center gap-3 border-b border-ink-200 pb-3">
                        <Skeleton className="size-14 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-14" />
                        </div>
                    </div>

                    {Array.from({ length: groupIndex === 0 ? 2 : 1 }).map((_, itemIndex) => (
                        <div
                            key={itemIndex}
                            className="flex gap-3 rounded-2xl border border-ink-200 p-3.5"
                        >
                            <div className="flex min-w-16 flex-col items-center gap-1.5">
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-2.5 w-8" />
                                <Skeleton className="h-3 w-px" />
                                <Skeleton className="h-2.5 w-10" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <Skeleton className="h-4 w-48 max-w-full" />
                                    <Skeleton className="size-2.5 rounded-full" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-3 w-28" />
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </CardContent>

        <CardFooter>
            <Skeleton className="h-3 w-40" />
        </CardFooter>
    </Card>
);

export const DashboardHomeSkeleton = ({
    showPaymentsCharts = true,
    showAppointmentsCharts = true,
    className,
}: DashboardHomeSkeletonProps) => {
    return (
        <div className={cn("mt-4 space-y-4", className)}>
            {showPaymentsCharts ? (
                <section className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
                    <ChartCardSkeleton variant="area" />
                    <ChartCardSkeleton variant="pie" />
                </section>
            ) : null}

            {showAppointmentsCharts ? (
                <>
                    <section className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
                        <ChartCardSkeleton variant="bar" />
                        <ChartCardSkeleton variant="pie" />
                    </section>

                    <section>
                        <UpcomingListSkeleton />
                    </section>
                </>
            ) : null}
        </div>
    );
};
