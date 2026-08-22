import { differenceInMinutes, format } from "date-fns";
import { es } from "date-fns/locale";

/** Hora en formato 12h compacto para las celdas del calendario: "9:30 AM" */
export const formatEventTime = (date: Date) =>
  format(date, "h:mm a", { locale: es }).replace(/\./g, "").toUpperCase();

/** Etiqueta horaria del eje vertical: "9 AM" */
export const formatAxisHour = (hour: number) =>
  format(new Date().setHours(hour, 0, 0, 0), "h a", { locale: es })
    .replace(/\./g, "")
    .toUpperCase();

export const formatDuration = (start: Date, end: Date) => {
  const minutes = Math.max(0, differenceInMinutes(end, start));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
};
