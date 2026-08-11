'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, TSignInForm } from "../schemas";
import { IPostSignInFormRequest } from "../interfaces";
import { CustomFormField, CustomPasswordFormField } from "@/components";
import { ArrowRight } from "lucide-react";
import { Button, Spinner } from "@/components";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { postSignIn, selectPostSignIn, getUserData, selectGetUserData } from "@/store/authentication/authentication-slice";
import { toast } from "sonner";

export const SignInTemplate = () => {
    const dispatch = useAppDispatch();
    const { status, message, error } = useAppSelector(selectPostSignIn);
    const { status: getUserDataStatus, message: getUserDataMessage } = useAppSelector(selectGetUserData);
    const router = useRouter();
    const methods = useForm<TSignInForm, IPostSignInFormRequest>({
        mode: 'onTouched',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(SignInSchema),
        defaultValues: { email: '', password: '' },
    })

    const { handleSubmit, formState: { isValid } } = methods;

    const onSubmit = async (data: IPostSignInFormRequest) => {
        dispatch(postSignIn(data));
    }

    useEffect(() => {
        if (status === 'error') {
            toast.error(message, {
                description: error,
            });
            return;
        }

        if (status === 'success') {
            toast.success(message);
            dispatch(getUserData());
            router.push('/dashboard');
        }
        
    }, [status, dispatch]);

    useEffect(() => {
        if (getUserDataStatus === 'error') {
            toast.error(getUserDataMessage);
            return;
        }
    }, [getUserDataStatus]);


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
                    <Button type="submit" disabled={status === 'loading' || !isValid} className="w-full">
                        {status === 'loading' ? (
                            <>
                                Iniciando sesión...
                                <Spinner />
                            </>
                        ) : (
                            <>
                                Iniciar sesión
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
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
