import { Skeleton } from "@/components/ui/skeleton";

interface CustomCardSkeletonProps {
  count?: number;
}

export const CustomCardSkeleton = ({ count = 1 }: CustomCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <article
          key={i}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm border-t-4 border-t-gray-200"
        >
          <header className="flex items-center justify-between p-4 pb-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="size-8 rounded-md" />
          </header>
          <div className="px-4 pb-4">
            <Skeleton className="h-8 w-16 mt-1" />
            <Skeleton className="h-3 w-24 mt-3" />
          </div>
        </article>
      ))}
    </>
  );
};
