import type { Metadata } from "next";
import { DashboardTemplate } from '@/features/dashboard/template';
import { noIndexRobots } from "@/lib/seo";
import { siteName } from "@/consts/site";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s | ${siteName}`,
  },
  robots: noIndexRobots,
};

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
    return <DashboardTemplate>{children}</DashboardTemplate>;
}