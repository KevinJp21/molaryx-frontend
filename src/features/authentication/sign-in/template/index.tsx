'use client'
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, TSignInForm } from "../schemas";
import { IPostSignInFormRequest } from "../interfaces";
import { CustomFormField, CustomPasswordFormField } from "@/components";
import { Button } from "@/components";
import Link from "next/link";

export const SignInTemplate = () => {
    const methods = useForm<TSignInForm, IPostSignInFormRequest>({
        mode: 'onTouched',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(SignInSchema),
        defaultValues: { email: '', password: '' },
    })

    const { handleSubmit, formState: { isSubmitting, isValid } } = methods;

    const onSubmit = async (data: IPostSignInFormRequest) => {
        console.log(data);
    }

    return (
        <div className="w-full max-w-md">
            <h1 className="font-semibold text-ink-50 text-2xl md:text-3xl">
                Inicia sesión
            </h1>
            <p className="mt-2 text-sm text-ink-300">
                Ingresa a tu cuenta para gestionar tu consultorio.
            </p>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-3">
                    <CustomFormField
                        name="email"
                        label="Correo electrónico"
                        placeholder="hector@example.com"
                        type="email"
                    />
                    <CustomPasswordFormField
                        name="password"
                        label="Contraseña"
                        showForgotPassword={true}
                    />
                    <Button type="submit" disabled={isSubmitting || !isValid} className="w-full">
                        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>
                </form>
            </FormProvider>
            <p className="mt-8 flex items-center justify-center gap-1 text-center text-sm text-ink-300">
                ¿No tienes una cuenta?
                <Link href="/sign-up" className="font-semibold text-accent-400 hover:text-accent-300">
                    Regístrate
                </Link>
            </p>

        </div>
    );
};
