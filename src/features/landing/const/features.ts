export type TFeatureId =
  | "patients"
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
    desc: "Mantén la información de cada paciente organizada, actualizada y disponible cuando la necesites.",
    bullets: [
      "Datos de contacto y información relevante en un solo perfil",
      "Historial de citas y servicios realizados",
      "Notas y observaciones por paciente",
    ],
  },
  {
    id: "agenda",
    title: "Agenda inteligente",
    desc: "Organiza la agenda de tu consultorio y gestiona tus horarios de forma clara y eficiente.",
    bullets: [
      "Vistas diaria, semanal y mensual",
      "Detección de traslapes y espacios disponibles",
      "Organización de citas por profesional y servicio",
    ],
  },
  {
    id: "appointments",
    title: "Citas organizadas",
    desc: "Programa y confirma citas fácilmente, manteniendo a tus pacientes informados y reduciendo las ausencias.",
    bullets: [
      "Estados: pendiente, confirmada, en sala y completada",
      "Recordatorios automáticos para tus pacientes",
      "Reprogramación y cancelación de citas",
    ],
  },
  {
    id: "payments",
    title: "Control de pagos y abonos",
    desc: "Controla cuánto se cobra, cuánto se ha pagado y qué saldos están pendientes en tu consultorio.",
    bullets: [
      "Registro de pagos y abonos por servicio",
      "Saldos pendientes y estados de cuenta",
      "Reportes de ingresos por periodo",
    ],
  },
  {
    id: "services",
    title: "Catálogo de servicios",
    desc: "Configura los servicios de tu consultorio con sus precios y duración para utilizarlos fácilmente en cada cita.",
    bullets: [
      "Servicios con precio y duración",
      "Organización por categorías",
      "Asignación de servicios a las citas",
    ],
  },
  {
    id: "admin",
    title: "Administración del consultorio",
    desc: "Configura los horarios, profesionales, colaboradores y permisos según las necesidades de tu consultorio.",
    bullets: [
      "Horarios y días laborales por profesional",
      "Equipo con roles y permisos",
      "Configuración de la información del consultorio",
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
    label: "Carlos R. · Profilaxis",
  },
  {
    row: 3,
    span: 2,
    color: "bg-indigo-500/70",
    label: "Ana T. · Valoración",
  },
  {
    row: 5,
    span: 1,
    color: "bg-emerald-500/70",
    label: "Jorge M. · Resina",
  },
] as const;

export const APPOINTMENT_ITEMS = [
  {
    time: "09:00",
    name: "María Fernández",
    svc: "Consulta odontológica",
    status: "Confirmada",
    tone: "text-emerald-300 bg-emerald-500/10",
  },
  {
    time: "10:30",
    name: "Carlos Ruiz",
    svc: "Profilaxis dental",
    status: "En sala",
    tone: "text-accent-300 bg-accent-500/10",
  },
  {
    time: "12:00",
    name: "Ana Torres",
    svc: "Primera valoración",
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
    svc: "Abono · tratamiento odontológico",
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
    name: "Limpieza dental",
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
    name: "Tratamiento odontológico",
    price: "$350.000",
    dur: "90 min",
    tone: "bg-emerald-500/15 text-emerald-300",
  },
] as const;

export const ADMIN_TEAM = [
  {
    name: "Dra. Salinas",
    role: "Administradora",
    tone: "text-accent-300",
  },
  {
    name: "Lic. Pérez",
    role: "Recepción",
    tone: "text-indigo-300",
  },
  {
    name: "Dr. López",
    role: "Profesional",
    tone: "text-emerald-300",
  },
] as const;

