'use client'

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, ErrorMessage } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPublicPlans, selectGetPublicPlans } from "@/store/plans/plans-slice";
import { getIdentificationTypes, selectGetIdentificationTypes } from "@/store/masters/masters-slice";
import { SIGN_UP_STEPS, STEP_FIELDS, SIGN_UP_DEFAULT_VALUES } from "../consts";
import { StepIndicator, StepPlan, PlanCardSkeleton, StepTenant, StepOwner } from "../components";
import { SignUpSchema, type TSignUpForm, type TSignUpFormValues } from "../schemas";

export const SignUpTemplate = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const { status: plansStatus, message: plansMessage } = useAppSelector(selectGetPublicPlans);
  const { status: identificationTypesStatus } = useAppSelector(selectGetIdentificationTypes);
  const plansLoading = plansStatus === 'idle' || plansStatus === 'loading';

  const methods = useForm<TSignUpForm, unknown, TSignUpFormValues>({
    defaultValues: SIGN_UP_DEFAULT_VALUES,
    mode: 'onTouched',
    resolver: zodResolver(SignUpSchema),
  });

  const { handleSubmit, trigger } = methods;

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields, { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, SIGN_UP_STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data: TSignUpFormValues) => {
    console.log("dispatching data", data);
  };

  useEffect(() => {
    if (identificationTypesStatus !== 'success') {
      dispatch(getIdentificationTypes());
    }
    if (plansStatus !== 'success') {
      dispatch(getPublicPlans());
    }
  }, [dispatch]);

  return (
    <div className="w-full max-w-md">
      <StepIndicator steps={SIGN_UP_STEPS} currentStep={step} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div>
              <h1 className="font-semibold text-3xl tracking-tight text-ink-50">
                Elige tu plan
              </h1>
              <p className="mt-2 text-sm text-ink-300">
                Puedes cambiar de plan más adelante desde la configuración de tu cuenta.
              </p>

              {plansLoading && <PlanCardSkeleton />}
              {plansStatus === 'error' && (
                <ErrorMessage
                  message={
                    plansMessage ??
                    'No se encontraron planes disponibles, intente nuevamente más tarde.'
                  }
                />
              )}
              {plansStatus === 'success' && <StepPlan />}
            </div>
          )}

          {step === 2 && <StepTenant />}

          {step === 3 && <StepOwner />}

          <div className="mt-9 flex items-center gap-3">
            {step > 1 && (
              <Button variant="outline" type="button" onClick={goBack}>
                <ArrowLeft className="h-4 w-4" />
                Atrás
              </Button>
            )}

            {step < SIGN_UP_STEPS.length ? (
              <Button
                variant="default"
                type="button"
                onClick={goNext}
                className="flex-1"
                disabled={step === 1 && (plansLoading || plansStatus === 'error')}
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="default" type="submit" className="flex-1">
                Crear cuenta
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SignUpTemplate;
