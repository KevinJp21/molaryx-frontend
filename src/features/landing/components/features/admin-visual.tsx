import { ADMIN_TEAM } from "../../const";
import { FeatureFrame } from "./feature-frame";

export const AdminVisual = () => {
  return (
    <FeatureFrame label="Administración">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/[0.06] bg-ink-850/60 p-3">
          <p className="text-[10px] text-ink-300">Horario</p>
          <p className="mt-1 text-xs font-semibold text-ink-50">Lun – Vie</p>
          <p className="text-[10px] text-ink-300">09:00 – 18:00</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-ink-850/60 p-3">
          <p className="text-[10px] text-ink-300">Consultorio</p>
          <p className="mt-1 text-xs font-semibold text-ink-50">Clínica Norte</p>
          <p className="text-[10px] text-ink-300">2 profesionales</p>
        </div>
      </div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-400">
        Equipo
      </p>
      <div className="space-y-2">
        {ADMIN_TEAM.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-ink-850/60 px-3 py-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-[10px] font-semibold text-ink-100">
              {member.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink-50">{member.name}</p>
              <p className={`text-[10px] ${member.tone}`}>{member.role}</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        ))}
      </div>
    </FeatureFrame>
  );
};
