import { Home, User, Layers, Calendar, Users, ClipboardPlus, ClipboardList, Wallet, FileText } from "lucide-react";
import { SidebarSection } from "../types";

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Principal",
    items: [{ label: "Inicio", href: "/dashboard", icon: Home }],
  },
  {
    title: "Pacientes",
    items: [
      {
        label: "Pacientes",
        href: "/dashboard/patients",
        icon: User,
        permission: { module: "PATIENTS" },
      },
      {
        label: "Historia clínica",
        href: "/dashboard/clinical-records",
        icon: FileText,
        permission: { module: "CLINICAL_RECORDS" },
      },
    ],
  },
  {
    title: "Servicios",
    items: [
      {
        label: "Servicios",
        href: "/dashboard/services",
        icon: Layers,
        permission: { module: "SERVICES" },
      },
    ],
  },
  {
    title: "Citas",
    items: [
      {
        label: "Citas",
        href: "/dashboard/appointments",
        icon: Calendar,
        permission: { module: "APPOINTMENTS" },
      },
    ],
  },
  {
    title: "Tratamientos",
    items: [
      {
        label: "Tratamientos",
        href: "/dashboard/treatments",
        icon: ClipboardPlus,
        permission: { module: "TREATMENTS" },
      },
      {
        label: "Planes de tratamiento",
        href: "/dashboard/patient-treatments",
        icon: ClipboardList,
        permission: { module: "PATIENT_TREATMENTS" },
      },
    ],
  },
  {
    title: "Pagos",
    items: [
      {
        label: "Pagos",
        href: "/dashboard/payments",
        icon: Wallet,
        permission: { module: "PAYMENTS" },
      },
    ],
  },
  {
    title: "Equipo",
    items: [
      {
        label: "Profesionales",
        href: "/dashboard/professionals",
        icon: Users,
        permission: { module: "USERS" },
      },
      {
        label: "Asistentes",
        href: "/dashboard/assistants",
        icon: User,
        permission: { module: "USERS" },
      },
    ],
  },
];
