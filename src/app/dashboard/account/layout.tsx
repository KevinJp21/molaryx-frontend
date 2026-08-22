import { AccountLayoutTemplate } from "@/features/dashboard/modules/account";

type Props = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: Props) {
  return <AccountLayoutTemplate>{children}</AccountLayoutTemplate>;
}
