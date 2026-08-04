import { SERVICE_ITEMS } from "../../const";
import { FeatureFrame } from "./feature-frame";

export const ServicesVisual = () => {
  return (
    <FeatureFrame label="Servicios">
      <div className="grid gap-2 sm:grid-cols-2">
        {SERVICE_ITEMS.map((service) => (
          <div
            key={service.name}
            className="rounded-lg border border-white/4 bg-ink-850/60 p-3"
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${service.tone}`}>
                {service.dur}
              </span>
              <span className="text-xs font-semibold text-ink-50">{service.price}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-ink-100">{service.name}</p>
          </div>
        ))}
      </div>
    </FeatureFrame>
  );
};
