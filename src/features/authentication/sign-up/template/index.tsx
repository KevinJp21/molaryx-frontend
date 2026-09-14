'use client'

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button, ErrorMessage, Spinner } from "@/components";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { postSignUp, resetPostSignUp, selectPostSignUp } from "@/store/authentication/authentication-slice";
import { getPublicPlans, selectGetPublicPlans } from "@/store/plans/plans-slice";
import { getIdentificationTypes, selectGetIdentificationTypes } from "@/store/masters/masters-slice";
import { SIGN_UP_STEPS, STEP_FIELDS, SIGN_UP_DEFAULT_VALUES } from "../consts";
import { StepIndicator, StepPlan, PlanCardSkeleton, StepTenant, StepOwner, RegisterSuccess } from "../components";
import { SignUpSchema, type TSignUpForm } from "../schemas";
import { IPostSignUpFormRequest } from "../interfaces";

export const SignUpTemplate = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const { status: plansStatus, message: plansMessage } = useAppSelector(selectGetPublicPlans);
  const { status: identificationTypesStatus } = useAppSelector(selectGetIdentificationTypes);
  const { status: postSignUpStatus, message: postSignUpMessage, error: postSignUpError } = useAppSelector(selectPostSignUp);
  const plansLoading = plansStatus === 'idle' || plansStatus === 'loading';

  const methods = useForm<TSignUpForm, unknown, IPostSignUpFormRequest>({
    defaultValues: SIGN_UP_DEFAULT_VALUES,
    mode: 'onTouched',
    resolver: zodResolver(SignUpSchema),
  });

  const { handleSubmit, trigger, reset } = methods;

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields, { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, SIGN_UP_STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: IPostSignUpFormRequest) => {
    dispatch(postSignUp(data));
  };

  useEffect(() => {
    if (identificationTypesStatus !== 'success') {
      dispatch(getIdentificationTypes());
    }
    if (plansStatus !== 'success') {
      dispatch(getPublicPlans());
    }
  }, [dispatch]);

  // Al entrar/salir de la página, limpia el estado del registro en Redux
  useEffect(() => {
    dispatch(resetPostSignUp());
    return () => {
      dispatch(resetPostSignUp());
    };
  }, [dispatch]);

  useEffect(() => {
    if (postSignUpStatus === 'success') {
      setIsRegisterSuccess(true);
      setStep(SIGN_UP_STEPS.length + 1);
      toast.success(postSignUpMessage ?? 'Cuenta creada exitosamente.');
      reset(SIGN_UP_DEFAULT_VALUES);
      dispatch(resetPostSignUp());
    }
    if (postSignUpStatus === 'error') {
      toast.error(postSignUpMessage ?? 'Error al crear la cuenta, intente nuevamente más tarde.', {
        description: postSignUpError,
      });
      dispatch(resetPostSignUp());
    }
  }, [postSignUpStatus, postSignUpMessage, postSignUpError, dispatch, reset]);

  return (
    <div className="w-full max-w-2xl">
      <StepIndicator steps={SIGN_UP_STEPS} currentStep={step} />

      {isRegisterSuccess ? (
        <RegisterSuccess />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div>
                <h1 className="font-semibold text-3xl tracking-tight text-ink-950">
                  Elige tu plan
                </h1>
                <p className="mt-2 text-sm text-ink-700">
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
                <Button variant="outline" type="button" onClick={goBack} className="rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </Button>
              )}

              {step < SIGN_UP_STEPS.length ? (
                <Button
                  key="continue"
                  variant="default"
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-full"
                  disabled={step === 1 && (plansLoading || plansStatus === 'error')}
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  key="submit"
                  variant="default"
                  type="submit"
                  className="flex-1 rounded-full"
                  disabled={postSignUpStatus === 'loading'}
                >
                  {postSignUpStatus === 'loading' ? (
                    <>
                      Creando cuenta
                      <Spinner />
                    </>
                  ) : (
                    <>
                      Crear cuenta
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
            {step === 1 && (
                <p className="mt-4 flex items-center justify-center gap-1 text-center text-sm text-ink-700">
                  ¿Ya tienes una cuenta?
                  <Link href="/sign-in" className="font-semibold text-accent-400 hover:text-accent-300 hover:underline">
                    Iniciar sesión
                  </Link>
                </p>
              )}
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default SignUpTemplate;
