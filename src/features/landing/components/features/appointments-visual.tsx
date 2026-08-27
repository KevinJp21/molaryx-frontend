import { Clock } from "lucide-react";
import { APPOINTMENT_ITEMS } from "../../const";
import { FeatureFrame } from "./feature-frame";

export const AppointmentsVisual = () => {
  return (
    <FeatureFrame label="Citas · Hoy">
      <div className="space-y-2">
        {APPOINTMENT_ITEMS.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-3 rounded-lg border border-ink-800/4 bg-ink-150/60 px-3 py-3"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-ink-950">{item.time}</span>
              <span className="flex items-center gap-0.5 text-[9px] text-ink-600">
                <Clock className="h-2.5 w-2.5" /> 45m
              </span>
            </div>
            <div className="h-8 w-px bg-white/6" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink-950">{item.name}</p>
              <p className="truncate text-[10px] text-ink-700">{item.svc}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.tone}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </FeatureFrame>
  );
};
