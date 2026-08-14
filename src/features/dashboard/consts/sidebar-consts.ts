import { Home, User, Layers } from "lucide-react";
import { SidebarSection } from "../types";

export const SIDEBAR_SECTIONS: SidebarSection[] = [
    {
        title: 'Principal',
        items: [
            { label: 'Inicio', href: '/dashboard', icon: Home }
        ]
    },
    {
        title: 'Pacientes',
        items: [
            { label: 'Pacientes', href: '/dashboard/patients', icon: User, permission: { module: 'PATIENTS' } }
        ]
    },
    {
        title: 'Servicios',
        items: [
            { label: 'Servicios', href: '/dashboard/services', icon: Layers, permission: { module: 'SERVICES' } }
        ]
    }
]