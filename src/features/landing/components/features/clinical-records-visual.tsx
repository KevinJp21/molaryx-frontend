import { FileText } from "lucide-react";
import { CLINICAL_RECORD_ROWS } from "../../const";
import { FeatureFrame } from "./feature-frame";

export const ClinicalRecordsVisual = () => {
  return (
    <FeatureFrame label="Historia clínica">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-600">
          Últimos registros
        </p>
        <span className="inline-flex items-center gap-1 rounded-md bg-accent-500/15 px-2 py-1 text-[11px] font-medium text-accent-300">
          <FileText className="h-3 w-3" />
          Historial
        </span>
      </div>
      <div className="space-y-2">
        {CLINICAL_RECORD_ROWS.map((row) => (
          <div
            key={`${row.patient}-${row.when}`}
            className="rounded-lg border border-ink-800/4 bg-ink-150/60 px-3 py-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink-950">
                  {row.patient}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-ink-700">
                  {row.reason}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${row.tone}`}
              >
                {row.tag}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-ink-600">{row.when}</p>
          </div>
        ))}
      </div>
    </FeatureFrame>
  );
};
