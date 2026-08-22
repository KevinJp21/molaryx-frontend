"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Logs, PlusIcon, SquarePen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getPatientTreatments,
  selectGetPatientTreatments,
} from "@/store/patient-treatments/patient-treatments-slice";
import { currencyFormat, formatDate } from "@/utils";
import { patientFullName } from "@/features/dashboard/modules/patients/utils";
import {
  Badge,
  BaseTable,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@/components";
import {
  PATIENT_TREATMENT_STATUS,
  PATIENT_TREATMENT_STATUS_COLORS,
  getTreatmentStatusLabel,
  isTreatmentStatusId,
  type TPatientTreatmentStatusFilter,
} from "../consts";
import { IPatientTreatmentItems } from "../interfaces";
import { PatientsTreatmentFilter } from "./patients-treatment-filter";
import { PatientTreatmentsSidebar } from "./patient-treatments-sidebar";
import { TGetPatientTreatmentsParams } from "../actions";

type Props = {
  onEdit: (item: IPatientTreatmentItems) => void;
  onViewDetails: (item: IPatientTreatmentItems) => void;
  onCreate?: () => void;
  canCreate?: boolean;
  canUpdate: boolean;
  refreshKey?: number;
};

const statusBadgeVariant = (id: number) => {
  if (id === PATIENT_TREATMENT_STATUS.ACTIVE) return "success" as const;
  if (id === PATIENT_TREATMENT_STATUS.CANCELLED) return "destructive" as const;
  if (id === PATIENT_TREATMENT_STATUS.COMPLETED) return "secondary" as const;
  return "muted" as const;
};

const statusBorderColor = (id: number) => {
  if (!isTreatmentStatusId(id)) return PATIENT_TREATMENT_STATUS_COLORS.all;
  return PATIENT_TREATMENT_STATUS_COLORS[id];
};

export const PatientTreatmentsTable = ({
  onEdit,
  onViewDetails,
  onCreate,
  canCreate = false,
  canUpdate,
  refreshKey = 0,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status, message, error } = useAppSelector(selectGetPatientTreatments);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TPatientTreatmentStatusFilter>("all");

  const listFilters: Pick<
    TGetPatientTreatmentsParams,
    "Search" | "IdPatientTreatmentStatus"
  > = {
    ...(search.trim() ? { Search: search.trim() } : {}),
    ...(statusFilter !== "all"
      ? { IdPatientTreatmentStatus: statusFilter }
      : {}),
  };

  const handleMobileFiltersChange = (filters: TGetPatientTreatmentsParams) => {
    setSearch(filters.Search ?? "");
    setStatusFilter(
      filters.IdPatientTreatmentStatus === undefined
        ? "all"
        : (filters.IdPatientTreatmentStatus as TPatientTreatmentStatusFilter),
    );
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(
      getPatientTreatments({
        Page: currentPage,
        ...listFilters,
      }),
    );
  }, [dispatch, currentPage, refreshKey, search, statusFilter]);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const colSpan = 7;
  const hasActiveFilters = Boolean(search.trim() || statusFilter !== "all");

  const filterParamsForForm: TGetPatientTreatmentsParams = {
    Page: 1,
    ...listFilters,
  };

  useEffect(() => {
    if (status === "success" && items.length === 0 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [status, items.length, currentPage]);

  return (
    <div className="relative flex min-h-160 w-full flex-1 flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_48px_-28px_rgba(124,77,255,0.45)] ring-1 ring-ink-700/70">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <PatientTreatmentsSidebar
          search={search}
          status={statusFilter}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          onCreateClick={onCreate}
          canCreate={canCreate}
        />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-ink-800 px-3 py-3 lg:hidden">
            {canCreate && onCreate && (
              <Button
                type="button"
                className="mb-3 h-11 w-full justify-center gap-2 rounded-2xl"
                onClick={onCreate}
              >
                <PlusIcon className="size-4" />
                Asignar tratamiento
              </Button>
            )}
            <PatientsTreatmentFilter
              params={filterParamsForForm}
              onFiltersChange={handleMobileFiltersChange}
            />
          </div>

          <BaseTable
            className="h-full rounded-none border-0 bg-transparent shadow-none ring-0"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={status === "loading" || status === "idle"}
            totalItems={data?.totalItems ?? 0}
            totalItemsView={items.length}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tratamiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead className="w-14 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              {(status === "loading" || status === "idle") && (
                <TableSkeleton columns={colSpan} rows={10} />
              )}
              <TableBody>
                {status === "error" && (
                  <TableRow>
                    <TableCell
                      colSpan={colSpan}
                      className="bg-coral-500/10 py-16 text-center text-sm text-coral-500 hover:bg-coral-500/15"
                    >
                      {error ?? message}
                    </TableCell>
                  </TableRow>
                )}
                {status === "success" && items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={colSpan}
                      className="py-16 group-hover/row:bg-transparent"
                    >
                      <div className="relative mx-auto flex max-w-sm flex-col items-center px-4 text-center">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 scale-150 rounded-full bg-linear-to-br from-accent-500/5 via-transparent to-accent-500/5 blur-3xl" />
                          <div className="relative rounded-3xl border border-ink-800 bg-linear-to-br from-ink-900/60 to-ink-900/20 p-5">
                            <ClipboardList
                              className="size-12 text-ink-500/40"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                        <p className="text-base font-medium text-ink-50">
                          {hasActiveFilters
                            ? "Sin resultados"
                            : "Aún no hay planes"}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                          {hasActiveFilters
                            ? "No hay planes con los filtros seleccionados. Ajusta la búsqueda o el estado."
                            : "Asigna el primer tratamiento a un paciente para empezar a hacer seguimiento."}
                        </p>
                        {!hasActiveFilters && canCreate && onCreate && (
                          <Button
                            type="button"
                            size="sm"
                            className="mt-5 rounded-xl"
                            onClick={onCreate}
                          >
                            <PlusIcon className="h-4 w-4" />
                            Asignar tratamiento
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {status === "success" &&
                  items.map((item) => {
                    const name =
                      patientFullName(item.patientName, item.patientSurname) ||
                      "—";

                    return (
                      <TableRow key={item.idPatientTreatment}>
                        <TableCell>
                          <div
                            className="relative flex min-w-40 flex-col gap-0.5 border-l-2 pl-3"
                            style={{
                              borderLeftColor: statusBorderColor(
                                item.idPatientTreatmentStatus,
                              ),
                            }}
                          >
                            <span className="font-medium text-ink-50">{name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex min-w-40 flex-col gap-0.5">
                            <span className="text-ink-100">{item.treatmentName}</span>
                            {item.notes && (
                              <span className="line-clamp-1 text-xs text-ink-400">
                                {item.notes}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(item.idPatientTreatmentStatus)}>
                            {getTreatmentStatusLabel(
                              item.idPatientTreatmentStatus,
                              item.patientTreatmentStatus,
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-ink-200">
                          {formatDate(item.startAt, "d MMM yyyy", { hour12: true })}
                        </TableCell>
                        <TableCell className="text-ink-200">
                          {item.endAt
                            ? formatDate(item.endAt, "d MMM yyyy", { hour12: true })
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-ink-100">
                              {item.agreedPrice != null
                                ? currencyFormat(item.agreedPrice)
                                : "—"}
                            </span>
                            <span className="text-xs text-ink-400">
                              {item.paymentFrequency ?? "Sin frecuencia"}
                              {item.periodicAmount != null
                                ? ` · ${currencyFormat(item.periodicAmount)}`
                                : ""}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Acciones de ${item.treatmentName}`}
                              >
                                <Logs className="size-4" strokeWidth={1.75} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="end">
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start text-xs font-normal text-ink-200"
                                  onClick={() => onViewDetails(item)}
                                >
                                  <Logs className="size-4" strokeWidth={1.75} />
                                  Ver detalles
                                </Button>
                                {canUpdate && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start text-xs font-normal text-ink-200"
                                    onClick={() => onEdit(item)}
                                  >
                                    <SquarePen
                                      className="size-4"
                                      strokeWidth={1.75}
                                    />
                                    Editar
                                  </Button>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </BaseTable>
        </div>
      </div>
    </div>
  );
};
