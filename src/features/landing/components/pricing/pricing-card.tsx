import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components";
import type { IPlan, IPlanUiMeta } from "../../interfaces";
import { formatPlanPrice, getPlanFeatureList, getPromotionDiscount } from "../../utils";

interface IPricingCardProps {
  plan: IPlan;
  meta: IPlanUiMeta;
}

export const PricingCard = ({ plan, meta }: IPricingCardProps) => {
  const features = getPlanFeatureList(plan);
  const promotion = plan.promotion;
  const hasPromotion = promotion !== undefined;
  const displayPrice = promotion?.price ?? plan.price;
  const discount = promotion
    ? getPromotionDiscount(plan.price, promotion.price)
    : undefined;

  return (
    <div
      className={`relative flex h-full w-full min-w-0 max-w-full flex-col rounded-2xl border p-5 transition-all duration-300 sm:p-8 ${
        meta.featured
          ? "border-accent-500/50 bg-ink-900/70 shadow-[0_20px_60px_-20px_rgba(124,77,255,0.35)]"
          : "border-white/8 bg-ink-900/40 hover:border-white/12 hover:bg-ink-850/60"
      }`}
    >
      {meta.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-500 px-3.5 py-1 text-[11px] font-semibold text-[#ffffff] shadow-lg">
          Más popular
        </span>
      )}

      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-ink-50">{plan.name}</h3>
          <p className="mt-2 text-sm text-ink-300">{meta.description}</p>
        </div>
        {hasPromotion && (
          <span className="shrink-0 rounded-full border border-accent-500/30 bg-accent-500/15 px-2.5 py-1 text-[11px] font-semibold text-accent-300">
            Founder
          </span>
        )}
      </div>

      <div className="mt-6 min-w-0">
        {hasPromotion && (
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-400 line-through">
              {formatPlanPrice(plan.price)}
            </span>
            {discount !== undefined && (
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                −{discount}%
              </span>
            )}
          </div>
        )}
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5">
          <span className="text-2xl font-semibold tracking-tight break-words text-ink-50 sm:text-3xl md:text-4xl">
            {formatPlanPrice(displayPrice)}
          </span>
          <span className="text-sm text-ink-300">/ mes</span>
        </div>
        {hasPromotion && (
          <p className="mt-2 text-xs font-medium text-accent-300">
            Precio exclusivo para fundadores
          </p>
        )}
      </div>

      <ul className="mt-8 flex min-w-0 flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex min-w-0 items-start gap-2.5 text-sm text-ink-200">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" strokeWidth={2} />
            <span className="min-w-0 break-words">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={meta.featured ? "default" : "outline"}
        className="mt-8 w-full min-w-0 whitespace-normal"
        asChild
      >
        <Link href={`/sign-in?plan=${plan.idPlan}`}>
          {meta.ctaLabel}
          <ArrowRight className="size-4 shrink-0" />
        </Link>
      </Button>
    </div>
  );
};
