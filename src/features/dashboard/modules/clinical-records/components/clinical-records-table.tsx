"use client";

import { useEffect, useState } from "react";
import { FileDownIcon, Logs, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getClinicalRecords,
  selectGetClinicalRecords,
} from "@/store/clinical-records/clinical-records-slice";
import { formatDate } from "@/utils";
import {
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
import { IClinicalRecordItems } from "../interfaces";
import { useDetailModalState } from "@/features/dashboard/hooks";
import { ClinicalRecordDetailModal } from "./clinical-record-detail-modal";
import { ClinicalRecordTableFilter } from "./clinical-record-table-filter";
import { TGetClinicalRecordsParams } from "../actions";
import { ClinicalRecordsSidebar } from "./clinical-records-sidebar";

type Props = {
  refreshKey?: number;
  onCreate: () => void;
  canCreate: boolean;
  onExport: () => void;
  canView: boolean;
  emptyMessage?: string;
};

const recordReference = (record: IClinicalRecordItems) => {
  if (record.appointment) return "Cita";
  if (record.patientTreatment) return "Plan de tratamiento";
  return "—";
};

const textPreview = (value: string | null) => {
  if (!value) return "—";
  if (value.length <= 60) return value;
  return `${value.slice(0, 60)}…`;
};

export const ClinicalRecordsTable = ({
  refreshKey = 0,
  onCreate,
  canCreate,
  onExport,
  canView,
  emptyMessage = "No hay registros clínicos.",
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status, message, error } = useAppSelector(
    selectGetClinicalRecords,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const {
    open: detailOpen,
    selected: selectedRecord,
    openDetails,
    handleOpenChange: handleDetailOpenChange,
  } = useDetailModalState<IClinicalRecordItems>();
  const colSpan = 6;

  const listFilters: Pick<TGetClinicalRecordsParams, "Search" | "From" | "To"> = {
    ...(search.trim() ? { Search: search.trim() } : {}),
    ...(from ? { From: from } : {}),
    ...(to ? { To: to } : {}),
  };

  const applyFilters = (filters: TGetClinicalRecordsParams) => {
    setSearch(filters.Search ?? "");
    setFrom(filters.From ?? "");
    setTo(filters.To ?? "");
    setCurrentPage(1);
  };

  const applySearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const applyFrom = (value: string) => {
    setFrom(value);
    setCurrentPage(1);
  };

  const applyTo = (value: string) => {
    setTo(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(
      getClinicalRecords({
        Page: currentPage,
        ...listFilters,
      }),
    );
  }, [dispatch, currentPage, refreshKey, search, from, to]);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const filterParamsForForm: TGetClinicalRecordsParams = {
    Page: 1,
    ...(search.trim() ? { Search: search.trim() } : {}),
    ...(from ? { From: from } : {}),
    ...(to ? { To: to } : {}),
  };

  useEffect(() => {
    if (status === "success" && items.length === 0 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [status, items.length, currentPage]);


  return (
    <div className="relative flex min-h-160 w-full flex-1 flex-col overflow-hidden rounded-2xl bg-ink-50 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_48px_-28px_rgba(124,77,255,0.45)] ring-1 ring-ink-300/70">
      <section className="flex min-h-0 flex-1 overflow-hidden">
        <ClinicalRecordsSidebar
          search={search}
          from={from}
          to={to}
          onSearchChange={applySearch}
          onFromChange={applyFrom}
          onToChange={applyTo}
          onCreate={onCreate}
          canCreate={canCreate}
          onExport={onExport}
          canView={canView}
        />
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-ink-200 px-3 py-3 lg:hidden">
            <div className="flex gap-x-3">
              {canView && (
                <Button variant="destructive" onClick={onExport} className="mb-3 h-11 flex-1/2 justify-center gap-2 rounded-2xl">
                  <FileDownIcon className="h-4 w-4" />
                  Exportar historia clínica
                </Button>
              )}
              {canCreate && (
                <Button
                  className="mb-3 h-11 flex-1/2 justify-center gap-2 rounded-2xl"
                  onClick={onCreate}
                >
                  <Plus className="size-5" />
                  <span className="text-sm">Crear registro clínico</span>
                </Button>
              )}
            </div>

            <ClinicalRecordTableFilter
              params={filterParamsForForm}
              onFiltersChange={applyFilters}
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Registrado por</TableHead>
                  <TableHead>Referencia</TableHead>
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
                      className="py-16 text-center text-sm text-ink-600 group-hover/row:bg-transparent"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
                {status === "success" &&
                  items.map((item) => (
                    <TableRow key={item.idClinicalRecord}>
                      <TableCell>
                        <div className="flex min-w-48 flex-col gap-0.5">
                          <span>
                            {item.patient.name} {item.patient.surname}
                          </span>
                          <span className="text-xs">{item.patient.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(item.recordedAt, "d MMM yyyy · HH:mm", {
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-1">{textPreview(item.reason)}</span>
                      </TableCell>
                      <TableCell>
                        {item.createdBy.name} {item.createdBy.surname}
                      </TableCell>
                      <TableCell>{recordReference(item)}</TableCell>
                      <TableCell className="text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Ver registro del ${formatDate(item.recordedAt, "d MMM yyyy")}`}
                            >
                              <Logs className="size-4" strokeWidth={1.75} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2" align="end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs font-normal text-ink-800"
                              onClick={() => openDetails(item)}
                            >
                              <Logs className="size-4" strokeWidth={1.75} />
                              Ver detalles
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </BaseTable>
        </div>
      </section>
      <ClinicalRecordDetailModal
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        record={selectedRecord}
      />
    </div>
  );
};
