"use client";

import { useEffect, useState } from "react";
import { Logs } from "lucide-react";
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
import { ClinicalRecordDetailModal } from "./clinical-record-detail-modal";

type Props = {
  refreshKey?: number;
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
  emptyMessage = "No hay registros clínicos.",
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status, message, error } = useAppSelector(
    selectGetClinicalRecords,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<IClinicalRecordItems | null>(null);
  const colSpan = 6;

  useEffect(() => {
    dispatch(
      getClinicalRecords({
        Page: currentPage,
      }),
    );
  }, [dispatch, currentPage, refreshKey]);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (status === "success" && items.length === 0 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [status, items.length, currentPage]);

  const openDetails = (record: IClinicalRecordItems) => {
    setSelectedRecord(record);
    setDetailOpen(true);
  };

  const handleDetailOpenChange = (next: boolean) => {
    setDetailOpen(next);
    if (!next) setSelectedRecord(null);
  };

  return (
    <>
      <section className="relative flex w-full flex-1 flex-col overflow-hidden">
        <BaseTable
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
                    className="py-16 text-center text-sm text-ink-400 group-hover/row:bg-transparent"
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
                            className="w-full justify-start text-xs font-normal text-ink-200"
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
      </section>
      <ClinicalRecordDetailModal
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        record={selectedRecord}
      />
    </>
  );
};
