"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger } from "../motion/gsap";
import { useIsomorphicLayoutEffect } from "../motion/utils";

interface IFeatureIndexItem {
  id: string;
  title: string;
}

interface IFeatureIndexProps {
  items: IFeatureIndexItem[];
}

export const FeatureIndex = ({ items }: IFeatureIndexProps) => {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const listRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const context = gsap.context(() => {
      items.forEach((item) => {
        const row = document.getElementById(`feature-${item.id}`);
        if (!row) return;

        ScrollTrigger.create({
          trigger: row,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => setActiveId(item.id),
          onEnterBack: () => setActiveId(item.id),
        });
      });
    });

    return () => context.revert();
  }, [items]);

  return (
    <div ref={listRef} className="sticky top-32">
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <Link
              key={item.id}
              href={`#feature-${item.id}`}
              scroll={false}
              className={cn(
                "block w-full rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                isActive
                  ? "bg-accent-500/10 font-medium text-accent-300 ring-1 ring-inset ring-accent-500/20"
                  : "text-ink-300 hover:bg-accent-500/10 hover:text-accent-300 hover:ring-1 hover:ring-inset hover:ring-accent-500/20"
              )}
            >
              <span className="min-w-0 truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
