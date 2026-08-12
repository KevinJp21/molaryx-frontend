import { DashboardTemplate } from '@/features';

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
    return <DashboardTemplate>{children}</DashboardTemplate>;
}