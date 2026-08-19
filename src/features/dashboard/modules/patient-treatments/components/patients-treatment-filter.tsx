'use client';

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

import {
    Button,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    CustomFormField,
    CustomFormSelect,
} from "@/components";
import { IS_ACTIVE_STATUS } from "@/features/dashboard/consts/is-active-status";
import { TGetPatientTreatmentsParams } from "../actions";
import { PATIENT_TREATMENT_STATUS_OPTION } from "../consts/patient-treatment-status";

type TPatientsTableFilterProps = {
    params: TGetPatientTreatmentsParams;
    onFiltersChange: (filters: TGetPatientTreatmentsParams) => void;
};

type TFormValues = {
    searchTerm: string;
    idPatientTreatmentStatus: number | typeof ALL_PATIENT_TREATMENT_STATUS_VALUE;
};

const ALL_PATIENT_TREATMENT_STATUS_VALUE = "all";

const PATIENT_TREATMENT_STATUS_ITEMS = [
    { value: ALL_PATIENT_TREATMENT_STATUS_VALUE, name: "Todos" },
    ...PATIENT_TREATMENT_STATUS_OPTION.map((s) => ({ value: s.value, name: s.name })),
];

export const PatientsTreatmentFilter = ({
    params,
    onFiltersChange,
}: TPatientsTableFilterProps) => {
    const [open, setOpen] = useState(false);

    const filterForm = useForm<TFormValues>({
        defaultValues: {
            searchTerm: params.Search ?? "",
            idPatientTreatmentStatus: ALL_PATIENT_TREATMENT_STATUS_VALUE,
        },
    });

    const { watch, reset } = filterForm;

    const searchTerm = watch("searchTerm");
    const idPatientTreatmentStatus = watch("idPatientTreatmentStatus");

    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const queryParams: TGetPatientTreatmentsParams = {};
        const term = debouncedSearch?.trim();
        if (term) queryParams.Search = term;
        if (idPatientTreatmentStatus !== ALL_PATIENT_TREATMENT_STATUS_VALUE) queryParams.IdPatientTreatmentStatus = idPatientTreatmentStatus;
        onFiltersChange(queryParams);
    }, [debouncedSearch, idPatientTreatmentStatus, onFiltersChange]);

    const handleReset = () => {
        reset({ searchTerm: "", idPatientTreatmentStatus: ALL_PATIENT_TREATMENT_STATUS_VALUE });
    };

    const activeCount = [
        debouncedSearch?.trim() ? 1 : 0,
        idPatientTreatmentStatus ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <FormProvider {...filterForm}>
                <div className="flex flex-wrap justify-between items-end gap-3 border-b border-ink-800 px-4 py-3">
                    <div className="max-w-75 w-full">

                    <CustomFormField
                        name="searchTerm"
                        label="Buscar"
                        type="text"
                        placeholder="Nombre, cédula, teléfono…"
                    />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(true)}
                        className="relative gap-2"
                    >
                        <SlidersHorizontal className="size-4" />
                        Filtros
                        {activeCount > 0 && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                                {activeCount}
                            </span>
                        )}
                    </Button>
                </div>
                <SheetContent>

                    <form className="flex h-full flex-col">
                        <SheetHeader>
                            <SheetTitle>Filtros</SheetTitle>
                            <SheetDescription>
                                Filtra la lista de pacientes por los criterios que necesites.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
                            <CustomFormSelect
                                name="idPatientTreatmentStatus"
                                label="Estado"
                                placeholder="Todos"
                                items={PATIENT_TREATMENT_STATUS_ITEMS.map((s) => ({ value: s.value, name: s.name }))}
                            />
                        </div>

                        <SheetFooter>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleReset}
                                className="gap-2 w-full"
                            >
                                <RotateCcw className="size-4" />
                                Reiniciar filtros
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </FormProvider>
        </Sheet>
    );
};
