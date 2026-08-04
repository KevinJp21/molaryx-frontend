import { Search, Plus } from "lucide-react";
import { PATIENT_ROWS } from "../../const";
import { FeatureFrame } from "./feature-frame";

export const PatientsVisual = () => {
  return (
    <FeatureFrame label="Pacientes">
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/6 bg-ink-850 px-3 py-2">
        <Search className="h-4 w-4 text-ink-400" />
        <span className="text-xs text-ink-400">Buscar paciente…</span>
        <span className="ml-auto flex items-center gap-1 rounded-md bg-accent-500/15 px-2 py-1 text-[11px] font-medium text-accent-300">
          <Plus className="h-3 w-3" /> Nuevo
        </span>
      </div>
      <div className="space-y-2">
        {PATIENT_ROWS.map((row) => (
          <div
            key={row.name}
            className="flex items-center gap-3 rounded-lg border border-white/4 bg-ink-850/60 px-3 py-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-700 text-xs font-semibold text-ink-100">
              {row.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink-50">{row.name}</p>
              <p className="text-[10px] text-ink-300">Última visita · hace 2 días</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${row.tone}`}>
              {row.tag}
            </span>
          </div>
        ))}
      </div>
    </FeatureFrame>
  );
};
