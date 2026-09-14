import type { ReactNode } from "react";

interface IFeatureFrameProps {
  children: ReactNode;
  label: string;
}

export const FeatureFrame = ({ children, label }: IFeatureFrameProps) => {
  return (
    <div className="relative w-full min-w-0 max-w-full">
      <div className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-linear-to-br from-accent-500/10 via-transparent to-coral-500/10 blur-2xl" />
      <div className="w-full max-w-full overflow-hidden rounded-2xl border border-ink-800/8 bg-ink-100 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-ink-800/6 bg-ink-150/80 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
          </div>
          <span className="ml-2 text-[11px] text-ink-600">{label}</span>
        </div>
        <div className="min-w-0 p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
};
