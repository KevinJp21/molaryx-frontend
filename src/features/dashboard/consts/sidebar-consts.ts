import {
  Home,
  User,
  Layers,
  Calendar,
  Users,
  ClipboardPlus,
  ClipboardList,
  Wallet,
  FileText,
} from "lucide-react";
import { PERMISSION_MODULES } from "./permission-codes";
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
        permission: { module: PERMISSION_MODULES.PATIENTS },
      },
      {
        label: "Historia clínica",
        href: "/dashboard/clinical-records",
        icon: FileText,
        permission: { module: PERMISSION_MODULES.CLINICAL_RECORDS },
      },
    ],
  },
  {
    title: "Procedimientos",
    items: [
      {
        label: "Procedimientos",
        href: "/dashboard/procedures",
        icon: Layers,
        permission: { module: PERMISSION_MODULES.PROCEDURES },
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
        permission: { module: PERMISSION_MODULES.TREATMENTS },
      },
      {
        label: "Planes de tratamiento",
        href: "/dashboard/patient-treatments",
        icon: ClipboardList,
        permission: { module: PERMISSION_MODULES.PATIENT_TREATMENTS },
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
        permission: { module: PERMISSION_MODULES.APPOINTMENTS },
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
        permission: { module: PERMISSION_MODULES.PAYMENTS },
      },
    ],
  },
  {
    title: "Equipo",
    items: [
      {
        label: "Equipo",
        href: "/dashboard/team",
        icon: Users,
        permission: { module: PERMISSION_MODULES.USERS },
      },
    ],
  },
];
