import { redirect } from "next/navigation";
import { ACCOUNT_BASE_PATH } from "@/features/dashboard/modules/account";

export default function AccountIndexPage() {
  redirect(`${ACCOUNT_BASE_PATH}/profile`);
}
