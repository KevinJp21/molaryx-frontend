import { Check } from 'lucide-react';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <li key={step.label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-accent-500 text-[#ffffff]'
                    : isCurrent
                      ? 'border-2 border-accent-500 text-accent-400'
                      : 'border border-ink-700 text-ink-400'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" strokeWidth={2.5} /> : stepNumber}
              </span>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  isCurrent ? 'text-ink-50' : isCompleted ? 'text-ink-200' : 'text-ink-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {stepNumber < steps.length && (
              <span
                className={`h-px flex-1 transition-colors duration-300 ${
                  isCompleted ? 'bg-accent-500' : 'bg-ink-700'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
