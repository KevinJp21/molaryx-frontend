import { DashboardTemplate } from '@/features/dashboard/template';

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
    return <DashboardTemplate>{children}</DashboardTemplate>;
}