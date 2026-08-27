import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import type { IFeature } from "../../const";
import { MaskReveal, Parallax, Reveal } from "../motion";

interface IFeatureItemProps {
  feature: IFeature;
  visual: ReactNode;
  index: number;
}

export const FeatureItem = ({ feature, visual, index }: IFeatureItemProps) => {
  return (
    <article
      id={`feature-${feature.id}`}
      className="scroll-mt-32 border-t border-ink-800/80 pt-10 lg:pt-14"
    >
      <div className="grid w-full min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          <MaskReveal
            as="h3"
            lines={[feature.title]}
            className="text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl"
          />

          <Reveal variant="up" delay={0.1} duration={0.8}>
            <p className="mt-4 text-ink-200">{feature.desc}</p>
          </Reveal>

          <Reveal as="ul" className="mt-6 space-y-3" delay={0.15} stagger={0.08}>
            {feature.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm text-ink-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                {bullet}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal variant="scale" delay={0.1} duration={1} className="min-w-0 w-full">
          <Parallax distance={index % 2 === 0 ? 22 : 40}>{visual}</Parallax>
        </Reveal>
      </div>
    </article>
  );
};
