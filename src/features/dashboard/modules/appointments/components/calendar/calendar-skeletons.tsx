"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { TCalendarView } from "../../types";

const Bone = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <div className={cn("animate-pulse rounded bg-ink-800/70", className)} style={style} />
);

const shell = "h-full overflow-hidden rounded-2xl bg-ink-950 ring-1 ring-ink-700/60";

// Patrones fijos: evitan desajustes de hidratación que causaría Math.random().
const WEEK_EVENT_PATTERN = [
  { top: 120, height: 90 },
  null,
  { top: 300, height: 140 },
  { top: 60, height: 60 },
  null,
  { top: 210, height: 110 },
  { top: 420, height: 80 },
];

const MONTH_EVENT_PATTERN = [true, false, true, true, false, false, true, false];

const MonthSkeleton = () => (
  <div className={shell}>
    <div className="grid grid-cols-7 border-b border-ink-800 bg-ink-900/40">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="border-r border-ink-800 px-2 py-3 text-center last:border-r-0">
          <Bone className="mx-auto h-4 w-8" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-7">
      {Array.from({ length: 35 }).map((_, index) => (
        <div key={index} className="min-h-[120px] border-b border-r border-ink-800 p-2">
          <Bone className="mb-2 h-4 w-6" />
          <div className="space-y-1">
            {MONTH_EVENT_PATTERN[index % MONTH_EVENT_PATTERN.length] && (
              <Bone className="h-5 w-full rounded-md" />
            )}
            {MONTH_EVENT_PATTERN[(index + 3) % MONTH_EVENT_PATTERN.length] && (
              <Bone className="h-5 w-3/4 rounded-md" />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const WeekSkeleton = () => (
  <div className={shell}>
    <div className="flex border-b border-ink-800 bg-ink-900/40">
      <div className="w-16 border-r border-ink-800 p-3">
        <Bone className="mx-auto h-8 w-10" />
      </div>
      <div className="grid flex-1 grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="border-r border-ink-800 px-2 py-3 text-center last:border-r-0">
            <Bone className="mx-auto mb-1 h-3 w-8" />
            <Bone className="mx-auto size-8 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
    <div className="flex" style={{ height: 600 }}>
      <div className="w-16 border-r border-ink-800">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="relative h-[60px]">
            <Bone className="absolute right-2 h-4 w-10 -translate-y-1/2" />
          </div>
        ))}
      </div>
      <div className="relative grid flex-1 grid-cols-7">
        {WEEK_EVENT_PATTERN.map((event, columnIndex) => (
          <div key={columnIndex} className="relative border-r border-ink-800 last:border-r-0">
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <div key={rowIndex} className="h-[60px] border-b border-dashed border-ink-800" />
            ))}
            {event && (
              <Bone
                className="absolute left-1 right-1 rounded-md"
                style={{ top: `${event.top}px`, height: `${event.height}px` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DaySkeleton = () => (
  <div className={shell}>
    <div className="border-b border-ink-800 bg-ink-900/40 px-6 py-4 text-center">
      <Bone className="mx-auto h-7 w-64" />
    </div>
    <div className="flex" style={{ height: 600 }}>
      <div className="w-20 border-r border-ink-800 bg-ink-900/20">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="relative h-[80px]">
            <Bone className="absolute left-1/2 h-4 w-12 -translate-x-1/2 -translate-y-1/2" />
          </div>
        ))}
      </div>
      <div className="relative flex-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-[80px] border-b border-dashed border-ink-800" />
        ))}
        <Bone className="absolute left-4 right-4 rounded-lg" style={{ top: 160, height: 120 }} />
        <Bone className="absolute left-4 right-4 rounded-lg" style={{ top: 400, height: 80 }} />
      </div>
    </div>
  </div>
);

const AgendaSkeleton = () => (
  <div className={cn(shell, "p-6")}>
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, groupIndex) => (
        <div key={groupIndex}>
          <Bone className="mb-4 h-5 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 2 + (groupIndex % 3) }).map((_, eventIndex) => (
              <div
                key={eventIndex}
                className="flex items-center gap-4 rounded-xl bg-ink-900/40 p-3"
              >
                <Bone className="size-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Bone className="h-4 w-3/4" />
                  <Bone className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ResourceSkeleton = () => (
  <div className={shell}>
    <div className="flex border-b border-ink-800 bg-ink-900/40">
      <div className="w-48 shrink-0 border-r border-ink-800 p-4">
        <Bone className="h-4 w-24" />
      </div>
      <div className="flex flex-1 gap-6 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Bone key={index} className="h-4 w-10" />
        ))}
      </div>
    </div>
    {Array.from({ length: 4 }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex min-h-[100px] border-b border-ink-800">
        <div className="flex w-48 shrink-0 items-center gap-3 border-r border-ink-800 p-4">
          <Bone className="size-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-24" />
            <Bone className="h-3 w-14" />
          </div>
        </div>
        <div className="relative flex-1 p-4">
          <Bone
            className="absolute h-14 rounded-md"
            style={{ left: `${8 + rowIndex * 14}%`, width: `${18 + rowIndex * 4}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

export const CalendarViewSkeleton = ({ view }: { view: TCalendarView }) => {
  if (view === "month") return <MonthSkeleton />;
  if (view === "week") return <WeekSkeleton />;
  if (view === "day") return <DaySkeleton />;
  if (view === "agenda") return <AgendaSkeleton />;
  return <ResourceSkeleton />;
};

export const CalendarSidebarSkeleton = () => (
  <div className="w-64 space-y-6 p-4">
    <Bone className="h-12 w-full rounded-2xl" />
    <div className="space-y-2">
      <div className="mb-2 flex items-center justify-between">
        <Bone className="h-4 w-20" />
        <div className="flex gap-1">
          <Bone className="size-6 rounded" />
          <Bone className="size-6 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }).map((_, index) => (
          <Bone key={index} className="mx-auto size-7 rounded" />
        ))}
      </div>
    </div>
    <div className="rounded-2xl bg-ink-900/60 p-3">
      <Bone className="mb-3 h-4 w-20" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Bone className="size-5 rounded" />
            <Bone className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
