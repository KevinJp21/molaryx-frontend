import { Skeleton } from "@/components";

export const PlanCardSkeleton = () => {
  return (
    <div className="mt-7 flex flex-col gap-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-start gap-4 rounded-2xl border border-ink-300 bg-ink-100/40 p-4 sm:p-5">
          <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-ink-300" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-28 bg-ink-300" />
            <Skeleton className="h-3 w-full max-w-55 bg-ink-200" />
            <Skeleton className="h-3 w-3/4 max-w-45 bg-ink-200" />
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <Skeleton className="h-4 w-16 bg-ink-300" />
            <Skeleton className="h-3 w-10 bg-ink-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

