"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentsTemplate } from "@/features/dashboard/modules/payments";
import { usePatientChart } from "@/features/dashboard/modules/patients";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";

export default function PatientPaymentsPage() {
    const { encodedId } = usePatientChart();
    const router = useRouter();
    const { data: userData } = useAppSelector(selectGetUserData);
    const canView = hasPermissionCode(
        userData?.permissions,
        "PAYMENTS",
        "GET_PAYMENTS",
    );

    useEffect(() => {
        if (!canView) {
            router.replace(`/dashboard/patients/${encodedId}`);
        }
    }, [canView, encodedId, router]);

    if (!canView) {
        return null;
    }

    return <PaymentsTemplate encodedPatientId={encodedId} />;
}
