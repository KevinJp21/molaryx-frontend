'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Check } from 'lucide-react';
import { currencyFormat } from '@/utils';
import { useAppSelector } from '@/store';
import { selectGetPublicPlans } from '@/store/plans/plans-slice';
import type { TSignUpForm } from '../schemas';
import { InputErrorMessage } from '@/components';
import { SIGN_UP_EXCLUDED_PLAN_IDS } from '../consts';

export function StepPlan() {
  const { control, setValue } = useFormContext<TSignUpForm>();
  const { data: plans } = useAppSelector(selectGetPublicPlans);
  const selectablePlans = plans?.filter(
    (plan) => !SIGN_UP_EXCLUDED_PLAN_IDS.includes(plan.idPlan),
  );

  return (
      <Controller
        name="idPlan"
        control={control}
        render={({ field, fieldState }) => (
            <div className="mt-7 flex flex-col gap-3">
              {selectablePlans?.map((plan) => {
                const selected = field.value === plan.idPlan;
                return (
                  <button
                    key={plan.idPlan}
                    type="button"
                    onClick={() => {
                      field.onChange(plan.idPlan);
                      setValue(
                        'idPromotion',
                        plan.promotionPlan?.idPromotion ?? null,
                        { shouldDirty: true },
                      );
                    }}
                    className={`relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 ${selected
                        ? 'border-accent-500 bg-accent-500/6 shadow-[0_0_0_1px] shadow-accent-500/40'
                        : 'border-ink-300 bg-ink-100/40 hover:border-ink-400 hover:bg-ink-150/50'
                      }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selected ? 'border-accent-500 bg-accent-500' : 'border-ink-400'
                        }`}
                    >
                      {selected && (
                        <Check className="h-3 w-3 text-ink-50" strokeWidth={3} />
                      )}
                    </span>

                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-ink-950">{plan.name}</span>
                        {plan.idPlan === 2 && (
                          <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-[10px] font-semibold text-accent-300">
                            Más popular
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-xs text-muted">{plan.description}</span>
                    </span>

                    <div className="relative shrink-0 text-right">
                      {plan.price !== null ? (
                        plan.promotionPlan !== null ? (
                          <>
                            <span className="absolute -top-7 -right-10 shrink-0 rounded-full border border-accent-500/30 bg-accent-500 px-2.5 py-1 text-[11px] font-semibold text-ink-50">
                              Founder
                            </span>
                            <span className="text-xs text-ink-600 line-through">
                              {currencyFormat(plan.price)}
                            </span>
                            <span className="block text-sm font-semibold text-ink-950">
                              {currencyFormat(plan.promotionPlan.price)}
                            </span>
                            <span className="block text-[11px] text-muted">/ mes</span>
                          </>
                        ) : (
                          <>
                            <span className="block text-sm font-semibold text-ink-950">
                              {currencyFormat(plan.price)}
                            </span>
                            <span className="block text-[11px] text-muted">/ mes</span>
                          </>
                        )
                      ) : (
                        <span className="block text-sm font-semibold text-ink-950">
                          Personalizado
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {fieldState.error && (
                <InputErrorMessage message={fieldState.error.message} />
              )}
            </div>
        )}
      />
  );
}
