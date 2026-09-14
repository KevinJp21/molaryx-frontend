import { ADMIN_TEAM } from "../../const";
import { FeatureFrame } from "./feature-frame";

export const AdminVisual = () => {
  return (
    <FeatureFrame label="Administración">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-ink-800/[0.06] bg-ink-150/60 p-3">
          <p className="text-[10px] text-ink-700">Horario</p>
          <p className="mt-1 text-xs font-semibold text-ink-950">Lun – Vie</p>
          <p className="text-[10px] text-ink-700">09:00 – 18:00</p>
        </div>
        <div className="rounded-lg border border-ink-800/[0.06] bg-ink-150/60 p-3">
          <p className="text-[10px] text-ink-700">Consultorio</p>
          <p className="mt-1 text-xs font-semibold text-ink-950">Clínica Norte</p>
          <p className="text-[10px] text-ink-700">2 profesionales</p>
        </div>
      </div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-600">
        Equipo
      </p>
      <div className="space-y-2">
        {ADMIN_TEAM.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-3 rounded-lg border border-ink-800/[0.04] bg-ink-150/60 px-3 py-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-300 text-[10px] font-semibold text-ink-900">
              {member.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink-950">{member.name}</p>
              <p className={`text-[10px] ${member.tone}`}>{member.role}</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        ))}
      </div>
    </FeatureFrame>
  );
};
