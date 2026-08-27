"use client";

import type { ReactNode } from "react";
import { MaskReveal } from "./mask-reveal";
import { Reveal } from "./reveal";

interface ISectionHeadingProps {
  eyebrow: string;
  titleLines: ReactNode[];
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}

export const SectionHeading = ({
  eyebrow,
  titleLines,
  description,
  align = "center",
  className,
}: ISectionHeadingProps) => {
  const isCentered = align === "center";

  return (
    <div
      className={`w-full min-w-0 ${isCentered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className ?? ""}`}
    >
      <Reveal variant="fade" duration={0.7}>
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-400/90">
          {eyebrow}
        </span>
      </Reveal>

      <MaskReveal
        as="h2"
        lines={titleLines}
        className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tighter text-ink-950 sm:text-4xl lg:text-[3.25rem]"
      />

      {description && (
        <Reveal variant="up" delay={0.15} duration={0.8}>
          <p
            className={`mt-5 text-base leading-relaxed text-ink-800 sm:text-lg ${isCentered ? "mx-auto max-w-2xl" : ""}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
};
