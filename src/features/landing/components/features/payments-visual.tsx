import { DollarSign, TrendingUp } from "lucide-react";
import { PAYMENT_CHART, PAYMENT_ROWS } from "../../const";
import { FeatureFrame } from "./feature-frame";

export const PaymentsVisual = () => {
  return (
    <FeatureFrame label="Pagos · Octubre">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-300">Ingresos del mes</p>
          <p className="mt-1 text-2xl font-semibold text-ink-50">$48,240</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
          <TrendingUp className="h-3 w-3" /> +18%
        </span>
      </div>
      <div className="mt-4 flex h-24 items-end gap-1.5">
        {PAYMENT_CHART.map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-linear-to-t from-accent-500/30 to-accent-400/80"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {PAYMENT_ROWS.map((row) => (
          <div
            key={row.name}
            className="flex items-center gap-3 rounded-lg border border-white/4 bg-ink-850/60 px-3 py-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/4 text-ink-200">
              <DollarSign className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink-50">{row.name}</p>
              <p className="truncate text-[10px] text-ink-300">{row.svc}</p>
            </div>
            <span className={`text-xs font-semibold ${row.tone}`}>{row.amt}</span>
          </div>
        ))}
      </div>
    </FeatureFrame>
  );
};
