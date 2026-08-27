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
  eyebrowDuration?: number;
  titleStagger?: number;
  titleDuration?: number;
  descriptionDelay?: number;
  descriptionDuration?: number;
  scrollStart?: string;
}

export const SectionHeading = ({
  eyebrow,
  titleLines,
  description,
  align = "center",
  className,
  eyebrowDuration = 0.7,
  titleStagger = 0.09,
  titleDuration = 1.1,
  descriptionDelay = 0.15,
  descriptionDuration = 0.8,
  scrollStart = "top 85%",
}: ISectionHeadingProps) => {
  const isCentered = align === "center";

  return (
    <div
      className={`w-full min-w-0 ${isCentered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className ?? ""}`}
    >
      <Reveal variant="fade" duration={eyebrowDuration} start={scrollStart}>
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-400/90">
          {eyebrow}
        </span>
      </Reveal>

      <MaskReveal
        as="h2"
        lines={titleLines}
        className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tighter text-ink-950 sm:text-4xl lg:text-[3.25rem]"
        stagger={titleStagger}
        duration={titleDuration}
        start={scrollStart}
      />

      {description && (
        <Reveal
          variant="up"
          delay={descriptionDelay}
          duration={descriptionDuration}
          start={scrollStart}
        >
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
