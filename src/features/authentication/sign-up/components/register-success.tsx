'use client'

import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components';
import Link from 'next/link';

export function RegisterSuccess() {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/15 text-accent-400">
        <CheckCircle2 className="h-7 w-7" />
      </span>

      <h1 className="mt-5 font-semibold text-3xl tracking-tight text-ink-950">
        ¡Registro completado!
      </h1>

      <p className="mt-3 text-sm text-ink-700">
        Recibimos los datos de tu consultorio. Cuando un administrador active tu
        cuenta, podrás entrar a Molaryx y empezar a operar.
      </p>

      <div className="mt-7 rounded-2xl border border-ink-300 bg-ink-100/50 px-5 py-4 text-left">
        <div className="p-2">
          <div className="space-y-2 text-sm text-ink-700">
            <p className="font-medium text-ink-900">¿Qué sigue?</p>
            <p>Te enviamos un correo de confirmación de registro.</p>
            <p>
              Un administrador revisará tu solicitud. Recibirás otro correo cuando
              tu cuenta esté activa y puedas acceder a la plataforma.
            </p>
          </div>
        </div>
      </div>

      <Button variant="default" className="mt-4" asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Regresar a la página de inicio
        </Link>
      </Button>
    </div>
  );
}
