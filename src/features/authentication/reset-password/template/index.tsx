"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CircleAlert, ShieldCheck } from "lucide-react";
import {
  Button,
  CustomPasswordFormField,
  Spinner,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  postResetPassword,
  resetPostResetPassword,
  selectPostResetPassword,
} from "@/store/authentication/authentication-slice";
import {
  ResetPasswordSchema,
  TResetPasswordForm,
} from "../schemas";

const ResetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const { status, message, error } = useAppSelector(selectPostResetPassword);

  const methods = useForm<TResetPasswordForm>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: TResetPasswordForm) => {
    if (!token) return;
    dispatch(
      postResetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    );
  };

  useEffect(() => {
    if (status === "error") {
      toast.error(message, {
        description: error,
      });
      dispatch(resetPostResetPassword());
      return;
    }

    if (status === "success") {
      toast.success(message);
    }
  }, [status, message, error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetPostResetPassword());
    };
  }, [dispatch]);

  return (
    <>
      {!token ? (
        <div className="flex flex-col">
          <div className="relative mb-7 w-fit">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-full bg-coral-500/10 blur-xl"
            />
            <div className="relative flex size-14 items-center justify-center rounded-2xl bg-ink-100 ring-1 ring-inset ring-coral-500/25">
              <CircleAlert
                className="size-7 text-coral-400"
                strokeWidth={1.75}
              />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-ink-950 md:text-3xl">
            Enlace no válido
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Este enlace de restablecimiento no es válido o ha expirado. Solicita
            uno nuevo para continuar.
          </p>

          <Button asChild className="mt-8 w-full rounded-full">
            <Link href="/forgot-password">
              Solicitar nuevo enlace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="mt-3 w-full rounded-full"
          >
            <Link href="/sign-in">
              <ArrowLeft className="h-4 w-4" />
              Volver a iniciar sesión
            </Link>
          </Button>
        </div>
      ) : status === "success" ? (
        <div className="flex flex-col">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent-400">
            Listo
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-950 md:text-3xl">
            Contraseña actualizada
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Tu contraseña se restableció correctamente. Ya puedes iniciar sesión
            con tu nueva clave.
          </p>

          <div className="mt-6 flex items-start gap-3 border-l-2 border-accent-500/50 py-1 pl-4">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-accent-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
                Estado
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink-900">
                Lista para iniciar sesión
              </p>
            </div>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-ink-600">
            Por seguridad, el enlace de restablecimiento ya no es válido.
          </p>

          <Button asChild className="mt-8 w-full rounded-full">
            <Link href="/sign-in">
              Ir a iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-ink-950 md:text-3xl">
            Nueva contraseña
          </h1>
          <p className="mt-2 text-sm text-ink-700">
            Elige una contraseña segura para tu cuenta de Molaryx.
          </p>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-7 flex flex-col gap-3"
            >
              <CustomPasswordFormField
                name="password"
                label="Nueva contraseña"
              />
              <CustomPasswordFormField
                name="confirmPassword"
                label="Confirmar contraseña"
              />
              <Button
                type="submit"
                disabled={status === "loading" || !isValid}
                className="w-full rounded-full"
              >
                {status === "loading" ? (
                  <>
                    Guardando contraseña...
                    <Spinner />
                  </>
                ) : (
                  <>
                    Restablecer contraseña
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </FormProvider>
          <p className="mt-8 flex items-center justify-center gap-1 text-center text-sm text-ink-700">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1 font-semibold text-accent-400 hover:text-accent-300 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver a iniciar sesión
            </Link>
          </p>
        </>
      )}
    </>
  );
};

export const ResetPasswordTemplate = () => {
  return (
    <div className="flex w-full max-w-md flex-1 flex-col justify-center">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};
