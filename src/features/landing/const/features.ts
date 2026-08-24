export type TFeatureId =
  | "patients"
  | "clinical"
  | "agenda"
  | "appointments"
  | "payments"
  | "services"
  | "admin";

export interface IFeature {
  id: TFeatureId;
  title: string;
  desc: string;
  bullets: string[];
}

export const FEATURES: IFeature[] = [
  {
    id: "patients",
    title: "Gestión de pacientes",
    desc: "Centraliza la información de cada paciente y tenla a mano en cada cita, sin importar tu especialidad.",
    bullets: [
      "Perfil con datos de contacto e identificación",
      "Historial de citas, procedimientos y tratamientos",
      "Acceso rápido a su historia clínica",
    ],
  },
  {
    id: "clinical",
    title: "Historia clínica y registros",
    desc: "Documenta cada atención con registros clínicos claros y construye el historial del paciente a lo largo del tiempo.",
    bullets: [
      "Registros con motivo, diagnóstico, evolución y notas",
      "Vinculación a cita, procedimiento o plan de tratamiento",
      "Historial clínico por paciente, listo para consultar o exportar",
    ],
  },
  {
    id: "agenda",
    title: "Agenda clara",
    desc: "Organiza los horarios de tu consultorio y visualiza la ocupación de tu equipo en un solo calendario.",
    bullets: [
      "Vistas diaria, semanal y mensual",
      "Detección de traslapes y espacios libres",
      "Citas por profesional y procedimiento",
    ],
  },
  {
    id: "appointments",
    title: "Citas bajo control",
    desc: "Programa, actualiza y da seguimiento a cada cita con estados claros durante todo el día.",
    bullets: [
      "Estados: pendiente, confirmada, en progreso y completada",
      "Reprogramación y cancelación sin fricción",
      "Visibilidad por profesional y por paciente",
    ],
  },
  {
    id: "payments",
    title: "Pagos y abonos",
    desc: "Registra cobros, controla saldos pendientes y entiende cómo entra el dinero a tu consultorio.",
    bullets: [
      "Pagos y abonos vinculados a la atención",
      "Saldos pendientes visibles",
      "Resumen de ingresos por periodo",
    ],
  },
  {
    id: "services",
    title: "Procedimientos y precios",
    desc: "Define el catálogo de procedimientos de tu consultorio con precio y duración para usarlos en cada cita.",
    bullets: [
      "Procedimientos con precio y duración",
      "Catálogo adaptable a tu especialidad",
      "Asignación rápida a las citas",
    ],
  },
  {
    id: "admin",
    title: "Equipo y consultorio",
    desc: "Configura profesionales, roles y la información de tu consultorio según cómo trabaja tu equipo.",
    bullets: [
      "Equipo con roles y permisos",
      "Profesionales listos para agenda y citas",
      "Datos del consultorio centralizados",
    ],
  },
];

export const PATIENT_ROWS = [
  {
    name: "María Fernández",
    initials: "MF",
    tag: "Activo",
    tone: "text-emerald-300 bg-emerald-500/10",
  },
  {
    name: "Carlos Ruiz",
    initials: "CR",
    tag: "Pago pendiente",
    tone: "text-accent-300 bg-accent-500/10",
  },
  {
    name: "Ana Torres",
    initials: "AT",
    tag: "Inactivo",
    tone: "text-red-300 bg-red-500/10",
  },
  {
    name: "Jorge Mendieta",
    initials: "JM",
    tag: "Activo",
    tone: "text-emerald-300 bg-emerald-500/10",
  },
] as const;

export const CLINICAL_RECORD_ROWS = [
  {
    patient: "María Fernández",
    reason: "Control de seguimiento",
    when: "Hoy · 09:20",
    tone: "text-accent-300 bg-accent-500/10",
    tag: "Registro",
  },
  {
    patient: "Carlos Ruiz",
    reason: "Evaluación inicial",
    when: "Ayer · 16:40",
    tone: "text-emerald-300 bg-emerald-500/10",
    tag: "Diagnóstico",
  },
  {
    patient: "Ana Torres",
    reason: "Evolución de tratamiento",
    when: "12 mar · 11:05",
    tone: "text-indigo-300 bg-indigo-500/10",
    tag: "Evolución",
  },
] as const;

export const AGENDA_HOURS = [
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
] as const;

export const AGENDA_BLOCKS = [
  {
    row: 0,
    span: 2,
    color: "bg-accent-500/80",
    label: "María F. · Consulta",
  },
  {
    row: 2,
    span: 1,
    color: "bg-coral-500/70",
    label: "Carlos R. · Control",
  },
  {
    row: 3,
    span: 2,
    color: "bg-indigo-500/70",
    label: "Ana T. · Evaluación",
  },
  {
    row: 5,
    span: 1,
    color: "bg-emerald-500/70",
    label: "Jorge M. · Seguimiento",
  },
] as const;

export const APPOINTMENT_ITEMS = [
  {
    time: "09:00",
    name: "María Fernández",
    svc: "Consulta general",
    status: "Confirmada",
    tone: "text-emerald-300 bg-emerald-500/10",
  },
  {
    time: "10:30",
    name: "Carlos Ruiz",
    svc: "Control de seguimiento",
    status: "En progreso",
    tone: "text-accent-300 bg-accent-500/10",
  },
  {
    time: "12:00",
    name: "Ana Torres",
    svc: "Evaluación inicial",
    status: "Pendiente",
    tone: "text-ink-200 bg-white/[0.06]",
  },
] as const;

export const PAYMENT_CHART = [
  42,
  58,
  35,
  70,
  52,
  88,
  64,
  95,
  72,
  100,
  80,
  60,
] as const;

export const PAYMENT_ROWS = [
  {
    name: "María F.",
    svc: "Consulta general",
    amt: "$80.000",
    tone: "text-emerald-300",
  },
  {
    name: "Carlos R.",
    svc: "Abono · plan de tratamiento",
    amt: "$120.000",
    tone: "text-emerald-300",
  },
  {
    name: "Ana T.",
    svc: "Saldo pendiente",
    amt: "$40.000",
    tone: "text-coral-400",
  },
] as const;

export const SERVICE_ITEMS = [
  {
    name: "Consulta general",
    price: "$80.000",
    dur: "45 min",
    tone: "bg-accent-500/15 text-accent-300",
  },
  {
    name: "Evaluación inicial",
    price: "$120.000",
    dur: "60 min",
    tone: "bg-coral-500/15 text-coral-400",
  },
  {
    name: "Control de seguimiento",
    price: "$50.000",
    dur: "30 min",
    tone: "bg-indigo-500/15 text-indigo-300",
  },
  {
    name: "Procedimiento especializado",
    price: "$350.000",
    dur: "90 min",
    tone: "bg-emerald-500/15 text-emerald-300",
  },
] as const;

export const ADMIN_TEAM = [
  {
    name: "Ana Salinas",
    role: "Administradora",
    tone: "text-accent-300",
  },
  {
    name: "Luis Pérez",
    role: "Asistente",
    tone: "text-indigo-300",
  },
  {
    name: "Carlos López",
    role: "Profesional",
    tone: "text-emerald-300",
  },
] as const;
