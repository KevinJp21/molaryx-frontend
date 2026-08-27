import type { Metadata } from "next";
import { DashboardTemplate } from '@/features/dashboard/template';
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
    return <DashboardTemplate>{children}</DashboardTemplate>;
}