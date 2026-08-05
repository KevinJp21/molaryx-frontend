import { LayoutGrid, CalendarDays, Users, Stethoscope, CreditCard, Settings, Activity, CircleDollarSign } from "lucide-react";

export const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Inicio", active: true },
  { icon: CalendarDays, label: "Agenda" },
  { icon: Users, label: "Pacientes" },
  { icon: Stethoscope, label: "Servicios" },
  { icon: CreditCard, label: "Pagos" },
  { icon: Settings, label: "Ajustes" },
];

export const DASHBOARD_METRICS = [
  {
    icon: CalendarDays,
    label: "Citas hoy",
    value: "9",
    delta: "+2",
    tone: "text-accent-300",
  },
  {
    icon: Users,
    label: "Pacientes activos",
    value: "186",
    delta: "+8",
    tone: "text-emerald-300",
  },
  {
    icon: CircleDollarSign,
    label: "Ingresos del mes",
    value: "$8,4M",
    delta: "+14%",
    tone: "text-emerald-300",
  },
  {
    icon: Activity,
    label: "Ocupación",
    value: "82%",
    delta: "+4%",
    tone: "text-accent-300",
  },
] as const;

export const DASHBOARD_REVENUE = {
  total: "$8.450.000",
  delta: "+14%",
  chart: [38, 55, 42, 68, 50, 82, 61, 90, 74, 100, 78, 65],
} as const;

export const APPOINTMENTS = [
  {
    time: "09:00",
    patient: "María Fernández",
    service: "Consulta odontológica",
    status: "Confirmada",
  },
  {
    time: "10:30",
    patient: "Carlos Ruiz",
    service: "Profilaxis dental",
    status: "En sala",
  },
  {
    time: "12:00",
    patient: "Ana Torres",
    service: "Primera valoración",
    status: "Pendiente",
  },
  {
    time: "15:30",
    patient: "Jorge Mendieta",
    service: "Resina · molar superior",
    status: "Confirmada",
  },
];

export const RECENT_PATIENTS = [
  { name: "María Fernández", initials: "MF", note: "Última visita · hace 2 días" },
  { name: "Carlos Ruiz", initials: "CR", note: "Abono pendiente · $150.000" },
  { name: "Ana Torres", initials: "AT", note: "Paciente nueva" },
];

export const STATUS_STYLES: Record<string, string> = {
  Confirmada: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
  "En sala": "bg-accent-500/15 text-accent-300 ring-accent-500/20",
  Pendiente: "bg-ink-500/40 text-ink-200 ring-white/10",
};

export const CALENDAR_DAYS = [
  null, null, null, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, null,
];

export const TODAY = 14;
export const MARKED = new Set([4, 9, 14, 18, 22, 27]);
