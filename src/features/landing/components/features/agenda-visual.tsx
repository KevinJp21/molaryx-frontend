import { AGENDA_BLOCKS, AGENDA_HOURS } from "../../const";
import { FeatureFrame } from "./feature-frame";

export const AgendaVisual = () => {
  return (
    <FeatureFrame label="Agenda · Semana">
      <div className="grid grid-cols-[40px_1fr] gap-2">
        {AGENDA_HOURS.map((hour, i) => (
          <div key={hour} className="contents">
            <span className="text-[10px] text-ink-600">{hour}:00</span>
            <div className="relative h-12 border-t border-ink-800/5">
              {AGENDA_BLOCKS.filter((block) => block.row === i).map((block) => (
                <div
                  key={block.label}
                  className={`absolute inset-x-0 top-0.5 rounded-md ${block.color} px-2 py-1 text-[10px] font-medium text-[#ffffff]`}
                  style={{ height: `${block.span * 48 - 4}px` }}
                >
                  {block.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FeatureFrame>
  );
};
