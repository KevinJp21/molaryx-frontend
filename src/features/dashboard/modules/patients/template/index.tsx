import { UserIcon } from "lucide-react";
import { PatientsTable } from "../components";

export const PatientsTemplate = () => {
    const cardsData: Array<{
        title: string;
        icon: React.ReactNode;
        color: string;
        mainValue: number;
        footerText?: string;
    }> = [
        {
            title: 'Total de pacientes',
            icon: <UserIcon className="w-5 h-5 text-white" />,
            color: 'bg-blue-500',
            mainValue: 100
        },
        {
            title: 'Pacientes activos',
            icon: <UserIcon className="w-5 h-5 text-white" />,
            color: 'bg-green-500',
            mainValue: 100
        },
        {
            title: 'Pacientes inactivos',
            icon: <UserIcon className="w-5 h-5 text-white" />,
            color: 'bg-red-500',
            mainValue: 100
        }
    ]
    return (
        <>
            <PatientsTable />
        </>
    )
}