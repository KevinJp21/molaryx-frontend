import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CustomCardProps {
  title: string;
  icon: ReactNode;
  mainValue: string | number;
  footerText?: string | number;
  className?: string;
  color?: CardColor;
}

/** Tonos semánticos alineados a la marca Molaryx (accent / coral + estados). */
export type CardColor = "accent" | "coral" | "green" | "yellow";

const colorVariants: Record<
  CardColor,
  {
    borderTopClass: string;
    iconBackgroundClass: string;
    iconTextClass: string;
    iconRingClass: string;
  }
> = {
  accent: {
    borderTopClass: "border-t-accent-500",
    iconBackgroundClass: "bg-ink-100",
    iconTextClass: "text-accent-500",
    iconRingClass: "ring-accent-500/20",
  },
  coral: {
    borderTopClass: "border-t-coral-500",
    iconBackgroundClass: "bg-ink-100",
    iconTextClass: "text-coral-500",
    iconRingClass: "ring-coral-500/20",
  },
  green: {
    borderTopClass: "border-t-emerald-500",
    iconBackgroundClass: "bg-ink-100",
    iconTextClass: "text-emerald-600",
    iconRingClass: "ring-emerald-500/20",
  },
  yellow: {
    borderTopClass: "border-t-amber-500",
    iconBackgroundClass: "bg-ink-100",
    iconTextClass: "text-amber-600",
    iconRingClass: "ring-amber-500/20",
  },
};

export const CustomCard = ({
  title,
  icon,
  mainValue,
  footerText,
  className,
  color = "accent",
}: CustomCardProps) => {
  const tone = colorVariants[color];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-ink-250 bg-ink-50 text-ink-900",
        "shadow-[0_1px_0_rgba(14,14,23,0.04),0_12px_40px_-28px_rgba(124,77,255,0.35)]",
        "border-t-4",
        tone.borderTopClass,
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-600">
          {title}
        </span>

        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
            tone.iconBackgroundClass,
            tone.iconTextClass,
            tone.iconRingClass,
          )}
        >
          {icon}
        </div>
      </header>

      <div className="px-5 pb-5">
        <p className="text-3xl font-semibold tracking-tight text-ink-950 tabular-nums leading-none">
          {mainValue}
        </p>

        {footerText !== undefined && footerText !== null && footerText !== "" ? (
          <p className="mt-3 text-xs leading-relaxed text-ink-600">{footerText}</p>
        ) : null}
      </div>
    </article>
  );
};

export default CustomCard;
