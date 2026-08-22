import { CreditCard, Settings, User } from "lucide-react";

export const ACCOUNT_BASE_PATH = "/dashboard/account";

export const ACCOUNT_NAV_ITEMS = [
  {
    label: "Perfil",
    href: `${ACCOUNT_BASE_PATH}/profile`,
    icon: User,
  },
  {
    label: "Configuración",
    href: `${ACCOUNT_BASE_PATH}/settings`,
    icon: Settings,
  },
  {
    label: "Facturación",
    href: `${ACCOUNT_BASE_PATH}/billing`,
    icon: CreditCard,
  },
] as const;
