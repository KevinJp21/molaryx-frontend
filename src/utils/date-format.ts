import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

export const APP_TIMEZONE = 'America/Bogota';

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const HAS_TZ_RE = /(?:Z|[+-]\d{2}:?\d{2})$/i;

type TFormatDateOptions = {
    /** Si es true, convierte la hora a formato 12h con AM/PM. Por defecto mantiene 24h. */
    hour12?: boolean;
};

const to12HourFormat = (formatStr: string) => {
    const hasHourToken = /H{1,2}|h{1,2}/.test(formatStr);
    if (!hasHourToken) return formatStr;

    let next = formatStr
        .replace(/HH/g, 'hh')
        .replace(/H/g, 'h');

    if (!/\ba\b/.test(next)) {
        next = `${next} a`;
    }

    return next;
};

const isDateOnlyString = (value: string) => DATE_ONLY_RE.test(value.trim());

/**
 * Interpreta un valor de la API como instante UTC.
 * Si el string no trae zona (`Z` u offset), se asume UTC.
 */
export const parseUtcDate = (value: string | Date): Date => {
    if (value instanceof Date) return value;

    const trimmed = value.trim();
    if (!trimmed) return new Date(Number.NaN);
    if (isDateOnlyString(trimmed)) return parseISO(trimmed);

    const withTz = HAS_TZ_RE.test(trimmed) ? trimmed : `${trimmed}Z`;
    const parsed = new Date(withTz);
    if (!Number.isNaN(parsed.getTime())) return parsed;

    return parseISO(trimmed);
};

/** Convierte un instante UTC a un Date con la hora de pared de Colombia. */
export const toColombiaDate = (value: string | Date): Date =>
    toZonedTime(parseUtcDate(value), APP_TIMEZONE);

/**
 * Interpreta fecha/hora de Colombia (formulario o calendario) y la serializa a ISO UTC.
 */
export const colombiaToUtcIso = (value: string | Date): string => {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        const normalized =
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)
                ? `${trimmed}:00`
                : trimmed;
        return fromZonedTime(normalized, APP_TIMEZONE).toISOString();
    }

    return fromZonedTime(value, APP_TIMEZONE).toISOString();
};

/**
 * Formats a date string or Date object into a readable format.
 * Los datetimes que vienen de la API (UTC) se muestran en hora de Colombia.
 * @param date - The date to format (string in ISO format or Date object).
 * @param formatStr - The format string (default: 'd de MMMM del yyyy').
 * @param options.hour12 - Optional. Uses 12-hour clock with AM/PM. Default is 24-hour.
 * @example
 * formatDate(new Date(), 'd/MM/yyyy', { hour12: true });
 * @returns The formatted date string.
 */
export const formatDate = (
    date: string | Date | null | undefined,
    formatStr: string = "d 'de' MMMM 'del' yyyy",
    options?: TFormatDateOptions,
): string => {
    if (!date) return '';

    try {
        const use12Hour = options?.hour12 === true;
        const resolvedFormat = use12Hour ? to12HourFormat(formatStr) : formatStr;
        const formatOptions = { locale: es };

        if (typeof date === 'string') {
            const trimmed = date.trim();

            if (isDateOnlyString(trimmed)) {
                const dateOnly = parseISO(trimmed);
                if (Number.isNaN(dateOnly.getTime())) return 'Fecha inválida';
                return format(dateOnly, resolvedFormat, formatOptions);
            }

            const utcDate = parseUtcDate(trimmed);
            if (Number.isNaN(utcDate.getTime())) return 'Fecha inválida';

            return formatInTimeZone(
                utcDate,
                APP_TIMEZONE,
                resolvedFormat,
                formatOptions,
            );
        }

        if (Number.isNaN(date.getTime())) {
            return 'Fecha inválida';
        }

        return format(date, resolvedFormat, formatOptions);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Fecha inválida';
    }
};

const MONTH_ABBR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

/** Formats an ISO date string "yyyy-MM-dd" into { month: "ENE", year: "2024" } */

export const formatPeriodLabel = (isoDate: string): { month: string; year: string } => {
    if (!isoDate) return { month: '—', year: '—' };
    const d = new Date(`${isoDate}T00:00:00`);
    return {
        month: MONTH_ABBR[d.getMonth()] ?? '—',
        year: String(d.getFullYear()),
    };
};
