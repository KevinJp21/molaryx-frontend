import { redirect } from "next/navigation";
import type { TBaseResponse } from "@/types";
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

const NETWORK_ERROR_MESSAGE =
    'No pudimos conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.';

const NETWORK_ERROR_PATTERNS = [
    'fetch failed',
    'failed to fetch',
    'networkerror',
    'network request failed',
    'load failed',
    'econnrefused',
    'econnreset',
    'enotfound',
    'etimedout',
    'socket hang up',
] as const;

const isNetworkErrorMessage = (message: string) => {
    const normalized = message.trim().toLowerCase();
    if (!normalized) return false;
    return NETWORK_ERROR_PATTERNS.some((pattern) => normalized.includes(pattern));
};

export type ApiErrorResult = {
    /** Mensaje general del backend o por código HTTP */
    message: string;
    /** Primer mensaje de validación del mapa `errors`, si existe */
    error?: string;
};

type ErrorBody = Partial<TBaseResponse<unknown>> & {
    /** Mapa de validación del backend (paths → mensajes), si existe */
    errors?: Record<string, string[]> | null;
};

type ParsedErrorBody = {
    message: string | null;
    error?: string;
};

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

/**
 * Extrae el primer mensaje de validación del mapa `errors` del backend.
 */
function getFirstValidationError(
    errors?: Record<string, string[]>,
): string | undefined {
    if (!errors) return undefined;

    for (const messages of Object.values(errors)) {
        const first = messages.find((item) => item.trim() !== '');
        if (first) return first.trim();
    }

    return undefined;
}

/**
 * Extrae message y primer error de validación del cuerpo parseado.
 */
export function extractServerMessageFromParsedBody(data: unknown): ParsedErrorBody {
    if (data == null) return { message: null };
    if (typeof data === 'string') {
        const text = data.trim();
        return { message: text || null };
    }
    if (!isErrorBody(data)) return { message: null };

    const message =
        typeof data.message === 'string' && data.message.trim()
            ? data.message.trim()
            : null;

    const errorFromMap = getFirstValidationError(getValidationErrors(data.errors));
    const errorFromField =
        typeof data.error === 'string' && data.error.trim()
            ? data.error.trim()
            : undefined;

    return { message, error: errorFromMap ?? errorFromField };
}

/**
 * Intenta extraer message/error del cuerpo de la respuesta.
 * Solo se puede consumir el stream una vez, por lo que se maneja con cuidado.
 */
async function parseErrorResponse(response?: Response): Promise<ParsedErrorBody> {
    if (!response) return { message: null };

    try {
        const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';

        if (contentType.includes('json')) {
            const data = await response.json();
            return extractServerMessageFromParsedBody(data);
        }

        const rawText = await response.text();
        if (rawText) {
            return extractServerMessageFromParsedBody(rawText);
        }
    } catch (e) {
        console.error('Error al obtener la respuesta de error:', e);
    }

    return { message: null };
}

type HandleApiErrorOptions = {
    /** Si es false, un 401 no redirige al login y solo retorna el mensaje */
    redirectOn401?: boolean;
};

const getErrorMessagesToInspect = (error: Error): string[] => {
    const messages = [error.message];
    const cause = (error as Error & { cause?: unknown }).cause;
    if (cause instanceof Error && cause.message) {
        messages.push(cause.message);
    } else if (typeof cause === 'string' && cause.trim()) {
        messages.push(cause);
    }
    return messages;
};

/**
 * Manejador centralizado de errores de API (contrato Molaryx Admin).
 * Retorna `{ message, error? }` donde `error` es el primer mensaje de validación.
 */
export async function handleApiError(
    error: unknown,
    options: HandleApiErrorOptions = {},
): Promise<ApiErrorResult> {
    const { redirectOn401 = true } = options;

    if (error instanceof ApiError) {
        const { status, response, body } = error;

        if (status === 401 && redirectOn401) {
            console.warn('Sesión expirada o no válida (401)');
            redirect('/sign-in?session=expired');
        }

        // 500: nunca mostrar detalles internos al usuario
        if (status >= 500) {
            return { message: DEFAULT_ERROR_MESSAGES[500] };
        }

        const parsed =
            body !== undefined
                ? extractServerMessageFromParsedBody(body)
                : await parseErrorResponse(response);

        return {
            message:
                parsed.message
                ?? DEFAULT_ERROR_MESSAGES[status]
                ?? FALLBACK_ERROR_MESSAGE,
            error: parsed.error,
        };
    }

    if (error instanceof Error) {
        console.error('Generic Error:', error.message);
        if (getErrorMessagesToInspect(error).some(isNetworkErrorMessage)) {
            return { message: NETWORK_ERROR_MESSAGE };
        }
        return { message: error.message || FALLBACK_ERROR_MESSAGE };
    }

    return { message: FALLBACK_ERROR_MESSAGE };
}
