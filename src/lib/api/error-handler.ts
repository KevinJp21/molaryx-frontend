import { redirect } from "next/navigation";
import type { BaseResponse } from "@/types";
import { ApiError } from "./types";

/**
 * Mapeo de mensajes de error predeterminados por código de estado HTTP.
 */
const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
    400: 'La solicitud no es válida, revise los datos enviados',
    401: 'Debe iniciar sesión para continuar',
    403: 'No tiene permiso para realizar esta acción',
    404: 'El recurso solicitado no fue encontrado',
    408: 'La solicitud tardó demasiado, vuelva a intentarlo',
    409: 'Conflicto con el estado actual del recurso',
    422: 'Los datos enviados no son válidos',
    429: 'Demasiadas solicitudes, espere un momento',
    500: 'Error interno del servidor, vuelva a intentarlo.',
    503: 'El servicio no está disponible por el momento',
};

const FALLBACK_ERROR_MESSAGE = 'Error inesperado, vuelva a intentarlo.';

type ErrorBody = Partial<BaseResponse<unknown>>;

const isErrorBody = (body: unknown): body is ErrorBody =>
    typeof body === 'object' && body !== null;

/**
 * Extrae el mensaje del cuerpo de error. La API siempre responde con la forma
 * de `BaseResponse`, así que se prioriza `message` y se usa `errors` como respaldo.
 * El cuerpo ya viene parseado desde `ApiClient`, no se vuelve a leer la respuesta.
 */
function getServerMessage(body: unknown): string | null {
    if (typeof body === 'string') {
        return body.trim() || null;
    }

    if (!isErrorBody(body)) return null;

    if (typeof body.message === 'string' && body.message.trim()) {
        return body.message.trim();
    }

    const errors = Array.isArray(body.errors)
        ? body.errors.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
        : [];

    return errors.length ? errors.join(', ') : null;
}

type HandleApiErrorOptions = {
    /** Si es false, un 401 no redirige al login y solo retorna el mensaje */
    redirectOn401?: boolean;
};

/**
 * Manejador centralizado de errores de API.
 * Procesa la excepción y retorna un mensaje amigable para el usuario.
 */
export function handleApiError(error: unknown, options: HandleApiErrorOptions = {}): string {
    const { redirectOn401 = true } = options;

    if (error instanceof ApiError) {
        const { status, body } = error;

        if (status === 401 && redirectOn401) {
            console.warn('Sesión expirada o no válida (401)');
            redirect('/sign-in?session=expired');
        }

        return getServerMessage(body)
            ?? DEFAULT_ERROR_MESSAGES[status]
            ?? FALLBACK_ERROR_MESSAGE;
    }

    if (error instanceof Error) {
        console.error('Generic Error:', error.message);
        return error.message;
    }

    return FALLBACK_ERROR_MESSAGE;
}
