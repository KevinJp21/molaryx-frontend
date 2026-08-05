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

export type ApiErrorResult = {
    /** Mensaje para toast / alert (negocio, auth, genérico) */
    message: string;
    /**
     * Errores de validación por campo (paths con punto, camelCase).
     * Presente solo cuando el backend envía `errors` con al menos una clave.
     */
    errors?: Record<string, string[]>;
    status: number;
};

type ErrorBody = Partial<BaseResponse<unknown>>;

const isErrorBody = (body: unknown): body is ErrorBody =>
    typeof body === 'object' && body !== null;

function getValidationErrors(errors: unknown): Record<string, string[]> | undefined {
    if (!errors || typeof errors !== 'object' || Array.isArray(errors)) {
        return undefined;
    }

    const entries = Object.entries(errors as Record<string, unknown>).filter(
        ([, messages]) =>
            Array.isArray(messages) &&
            messages.some((item) => typeof item === 'string' && item.trim() !== ''),
    );

    if (!entries.length) return undefined;

    return Object.fromEntries(
        entries.map(([path, messages]) => [
            path,
            (messages as string[]).filter(
                (item): item is string => typeof item === 'string' && item.trim() !== '',
            ),
        ]),
    );
}

function parseErrorBody(body: unknown): {
    message: string | null;
    errors?: Record<string, string[]>;
} {
    if (typeof body === 'string') {
        const text = body.trim();
        return { message: text || null };
    }

    if (!isErrorBody(body)) {
        return { message: null };
    }

    const message =
        typeof body.message === 'string' && body.message.trim()
            ? body.message.trim()
            : null;

    return {
        message,
        errors: getValidationErrors(body.errors),
    };
}

type HandleApiErrorOptions = {
    /** Si es false, un 401 no redirige al login y solo retorna el mensaje */
    redirectOn401?: boolean;
};

/**
 * Manejador centralizado de errores de API (contrato Molaryx Admin).
 *
 * - Validación (400 + `errors`): retorna `errors` para setError por path.
 * - Negocio / auth / 404 / 409: retorna `message` para toast (sin errors).
 * - 500: toast genérico; no expone detalles del servidor.
 */
export function handleApiError(
    error: unknown,
    options: HandleApiErrorOptions = {},
): ApiErrorResult {
    const { redirectOn401 = true } = options;

    if (error instanceof ApiError) {
        const { status, body } = error;

        if (status === 401 && redirectOn401) {
            console.warn('Sesión expirada o no válida (401)');
            redirect('/sign-in?session=expired');
        }

        // 500: nunca mostrar detalles internos al usuario
        if (status >= 500) {
            return {
                message: DEFAULT_ERROR_MESSAGES[500],
                status,
            };
        }

        const { message, errors } = parseErrorBody(body);
        const resolvedMessage =
            message
            ?? DEFAULT_ERROR_MESSAGES[status]
            ?? FALLBACK_ERROR_MESSAGE;

        return {
            message: resolvedMessage,
            errors,
            status,
        };
    }

    if (error instanceof Error) {
        console.error('Generic Error:', error.message);
        return {
            message: error.message,
            status: 0,
        };
    }

    return {
        message: FALLBACK_ERROR_MESSAGE,
        status: 0,
    };
}
