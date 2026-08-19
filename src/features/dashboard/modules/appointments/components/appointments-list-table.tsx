"use client";

import { useEffect, useState } from "react";
import { Logs } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getAppointmentsList,
  selectGetAppointmentsList,
} from "@/store/appointments/appointments-slice";
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
  getAppointmentStatusLabel,
} from "../consts";
import { IAppointmentListItems } from "../interfaces";
import { toColombiaDate, formatDate } from "@/utils";
import { AppointmentDetailModal } from "./appointment-detail-modal";

const fullName = (...parts: Array<string | null | undefined>) =>
  parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

const statusBadgeVariant = (id: number) => {
  if (id === 2 || id === 4) return "success" as const;
  if (id === 5 || id === 6) return "destructive" as const;
  if (id === 3) return "secondary" as const;
  return "muted" as const;
};

export const AppointmentsListTable = () => {
  const dispatch = useAppDispatch();
  const { data, status, message, error } = useAppSelector(selectGetAppointmentsList);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<IAppointmentListItems | null>(null);

  useEffect(() => {
    dispatch(
      getAppointmentsList({
        Page: currentPage,
      }),
    );
  }, [dispatch, currentPage]);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const colSpan = 6;

  useEffect(() => {
    if (status === "success" && items.length === 0 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [status, items.length, currentPage]);

  const openDetails = (item: IAppointmentListItems) => {
    setSelected(item);
    setDetailOpen(true);
  };

  const handleDetailOpenChange = (next: boolean) => {
    setDetailOpen(next);
    if (!next) setSelected(null);
  };

  return (
    <>
      <section className="flex-1 relative flex w-full flex-col overflow-hidden">
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
                <TableHead>Servicio</TableHead>
                <TableHead>Profesional</TableHead>
                <TableHead>Fecha y hora</TableHead>
                <TableHead>Estado</TableHead>
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
                    className="py-16 text-center text-sm text-coral-500 bg-coral-500/10 hover:bg-coral-500/15"
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
                    No hay citas registradas.
                  </TableCell>
                </TableRow>
              )}
              {status === "success" &&
                items.map((item) => {
                  const patientName = fullName(
                    item.patientName,
                    item.patientSurname,
                  );
                  const professionalName = fullName(
                    item.professionalName,
                    item.professionalSurname,
                  );

                  return (
                    <TableRow key={item.idAppointment}>
                      <TableCell>
                        <span className="min-w-40">{patientName}</span>
                      </TableCell>
                      <TableCell>{item.serviceName}</TableCell>
                      <TableCell>{professionalName}</TableCell>
                      <TableCell>
                        <div className="flex min-w-44 flex-col gap-0.5">
                          <span>
                            {formatDate(item.startAt, "d MMM yyyy")}
                          </span>
                          <span className="text-xs text-ink-400">
                            {formatDate(toColombiaDate(item.startAt), "h:mm a")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusBadgeVariant(item.idAppointmentStatus)}
                        >
                          {getAppointmentStatusLabel(
                            item.idAppointmentStatus,
                            item.appointmentStatus,
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Acciones de cita ${item.serviceName}`}
                            >
                              <Logs className="size-4" strokeWidth={1.75} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2" align="end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs justify-start text-ink-200 font-normal"
                              onClick={() => openDetails(item)}
                            >
                              <Logs className="size-4" strokeWidth={1.75} />
                              Ver detalles
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </BaseTable>
      </section>
      <AppointmentDetailModal
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        appointment={selected}
      />
    </>
  );
};
