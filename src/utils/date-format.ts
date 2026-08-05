import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formats a date string or Date object into a readable format.
 * @param date - The date to format (string in ISO format or Date object).
 * @param formatStr - The format string (default: 'dd/MM/yyyy').
 * @returns The formatted date string.
 */
export const formatDate = (date: string | Date | null | undefined, formatStr: string = "d 'de' MMMM 'del' yyyy"): string => {

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


        return format(dateObj, formatStr, { locale: es });
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

