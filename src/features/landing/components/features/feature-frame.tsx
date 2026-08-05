import type { ReactNode } from "react";

interface IFeatureFrameProps {
  children: ReactNode;
  label: string;
}

export const FeatureFrame = ({ children, label }: IFeatureFrameProps) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-linear-to-br from-accent-500/10 via-transparent to-coral-500/10 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-ink-900 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/6 bg-ink-850/80 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="ml-2 text-[11px] text-ink-400">{label}</span>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
