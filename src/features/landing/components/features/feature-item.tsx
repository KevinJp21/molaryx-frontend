import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import type { IFeature } from "../../const";

interface IFeatureItemProps {
  feature: IFeature;
  visual: ReactNode;
  reverse?: boolean;
}

export const FeatureItem = ({ feature, visual, reverse = false }: IFeatureItemProps) => {
  return (
    <div
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">
          {feature.title}
        </h3>
        <p className="mt-4 text-ink-200">{feature.desc}</p>
        <ul className="mt-6 space-y-3">
          {feature.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-sm text-ink-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
      <div>{visual}</div>
    </div>
  );
};
