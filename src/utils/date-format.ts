import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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

/**
 * Formats a date string or Date object into a readable format.
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
        let dateObj: Date;
        if (typeof date === 'string') {
            dateObj = parseISO(date);
            // If parseISO fails, try new Date()
            if (isNaN(dateObj.getTime())) {
                dateObj = new Date(date);
            }
        } else {
            dateObj = date;
        }

        if (isNaN(dateObj.getTime())) {
            return 'Fecha inválida';
        }

        const use12Hour = options?.hour12 === true;
        const resolvedFormat = use12Hour ? to12HourFormat(formatStr) : formatStr;

        return format(dateObj, resolvedFormat, { locale: es });
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
