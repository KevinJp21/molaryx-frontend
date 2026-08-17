"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PatientTreatmentsTemplate } from "@/features/dashboard/modules/patients/modules/patient-treatments";
import { usePatientChart } from "@/features/dashboard/modules/patients";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";

export default function PatientTreatmentsPage() {
    const { encodedId } = usePatientChart();
    const router = useRouter();
    const { data: userData } = useAppSelector(selectGetUserData);
    const canView = hasPermissionCode(
        userData?.permissions,
        "PATIENT_TREATMENTS",
        "GET_PATIENT_TREATMENTS",
    );

    useEffect(() => {
        if (!canView) {
            router.replace(`/dashboard/patients/${encodedId}`);
        }
    }, [canView, encodedId, router]);

    if (!canView) {
        return null;
    }

    return <PatientTreatmentsTemplate encodedPatientId={encodedId} />;
}
