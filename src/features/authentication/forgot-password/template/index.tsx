'use client'

import { useEffect } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, Inbox } from "lucide-react";
import { Button, CustomFormField, Spinner } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
    postForgotPassword,
    selectPostForgotPassword,
} from "@/store/authentication/authentication-slice";
import { ForgotPasswordSchema } from "../schemas";
import { IPostForgotPasswordFormRequest } from "../interfaces";

export const ForgotPasswordTemplate = () => {
    const dispatch = useAppDispatch();
    const { status, message, error } = useAppSelector(selectPostForgotPassword);

    const methods = useForm<IPostForgotPasswordFormRequest>({
        mode: "onTouched",
        reValidateMode: "onSubmit",
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const {
        handleSubmit,
        formState: { isValid },
        getValues,
    } = methods;

    const onSubmit = (data: IPostForgotPasswordFormRequest) => {
        dispatch(postForgotPassword(data));
    };

    useEffect(() => {
        if (status === "error") {
            toast.error(message, {
                description: error,
            });
            return;
        }

        if (status === "success") {
            toast.success(message);
        }
    }, [status, message, error]);

    const submittedEmail = getValues("email");

    return (
        <div className="flex w-full max-w-md flex-1 flex-col justify-center">
            {status === "success" ? (
                <div className="flex flex-col">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent-400">
                        Correo enviado
                    </p>

                    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-50 md:text-3xl">
                        Revisa tu bandeja
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-ink-300">
                        Si existe una cuenta asociada, te enviamos un enlace para
                        restablecer la contraseña.
                    </p>

                    <div className="mt-6 flex items-start gap-3 border-l-2 border-accent-500/50 py-1 pl-4">
                        <Inbox
                            className="mt-0.5 size-4 shrink-0 text-accent-400"
                            strokeWidth={1.75}
                            aria-hidden
                        />
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
                                Destinatario
                            </p>
                            <p className="mt-0.5 truncate text-sm font-medium text-ink-100">
                                {submittedEmail || "tu correo"}
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 text-[13px] leading-relaxed text-ink-400">
                        Puede tardar unos minutos. Si no lo ves, revisa spam o correo
                        no deseado.
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
                    <h1 className="text-2xl font-semibold text-ink-50 md:text-3xl">
                        Recuperación de contraseña
                    </h1>
                    <p className="mt-2 text-sm text-ink-300">
                        Ingresa tu correo electrónico para recibir un enlace para
                        restablecer tu contraseña.
                    </p>
                    <FormProvider {...methods}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-7 flex flex-col gap-3"
                        >
                            <CustomFormField
                                name="email"
                                label="Correo electrónico"
                                placeholder="hector@example.com"
                                type="email"
                            />
                            <Button
                                type="submit"
                                disabled={status === "loading" || !isValid}
                                className="w-full rounded-full"
                            >
                                {status === "loading" ? (
                                    <>
                                        Enviando correo...
                                        <Spinner />
                                    </>
                                ) : (
                                    <>
                                        Enviar correo
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </FormProvider>
                </>
            )}
        </div>
    );
};
