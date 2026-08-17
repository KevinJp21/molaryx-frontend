import { redirect } from "next/navigation";
import { decodeId } from "@/utils/code-and-decode-id";
import { PatientChartLayout } from "@/features/dashboard/modules/patients";

type Props = {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
};

export default async function PatientDetailsRouteLayout({
    children,
    params,
}: Props) {
    const { id: encodedId } = await params;
    const idPatient = Number(decodeId(encodedId));

    if (!idPatient) {
        redirect("/dashboard/patients");
    }

    return (
        <PatientChartLayout encodedId={encodedId} idPatient={idPatient}>
            {children}
        </PatientChartLayout>
    );
}
