import { Building2, Home } from "lucide-react";
import { PERMISSION_MODULES } from "./permission-codes";
import { SidebarSection } from "../types";

export const PLATFORM_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Principal",
    items: [{ label: "Inicio", href: "/platform", icon: Home }],
  },
  {
    title: "Administración",
    items: [
      {
        label: "Tenants",
        href: "/platform/tenants",
        icon: Building2,
        permission: { module: PERMISSION_MODULES.TENANTS },
      },
    ],
  },
];
