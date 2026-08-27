"use client";

import { useEffect } from "react";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { BaseModal, Button, Spinner } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  putUpdateTenant,
  resetPutUpdateTenant,
  selectPutUpdateTenant,
} from "@/store/tenants/tenants-slice";
import type { IPutUpdateTenantRequest } from "../interfaces";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  tenantName: string;
  payload: IPutUpdateTenantRequest | null;
  onSuccess?: () => void;
};

export const ConfirmUpdateTenantModal = ({
  open,
  onOpenChange,
  tenantName,
  payload,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const { status, message, error } = useAppSelector(selectPutUpdateTenant);
  const isSubmitting = status === "loading";

  const handleDialogOpenChange = (next: boolean) => {
    if (!next && status !== "idle") {
      dispatch(resetPutUpdateTenant());
    }
    onOpenChange(next);
  };

  const onConfirm = () => {
    if (!payload) return;
    dispatch(putUpdateTenant(payload));
  };

  useEffect(() => {
    if (status === "error") {
      toast.error(message ?? "No se pudo actualizar el consultorio.", {
        description: error,
      });
      dispatch(resetPutUpdateTenant());
    }
    if (status === "success") {
      toast.success(
        message ?? "Consultorio actualizado de manera exitosa.",
      );
      handleDialogOpenChange(false);
      dispatch(resetPutUpdateTenant());
      onSuccess?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync con status de update
  }, [status, dispatch, message, error]);

  return (
    <BaseModal
      open={open}
      onOpenChange={handleDialogOpenChange}
      className="max-w-md"
      icon={<SquarePen className="size-3.5" strokeWidth={2} />}
      title="Confirmar cambios"
      description="¿Estás seguro de guardar estos cambios?"
    >
      <div className="px-5 py-4">
        <div className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-3">
          <p className="text-sm font-medium tracking-tight text-ink-50">
            {tenantName}
          </p>
          {payload && (
            <p className="mt-1 font-mono text-xs tabular-nums text-ink-400">
              #{payload.idTenant}
            </p>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-300">
          Se actualizarán los datos del consultorio, propietario y/o
          suscripción según lo que hayas modificado.
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-ink-800 bg-ink-900/40 px-5 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 font-medium"
          onClick={() => handleDialogOpenChange(false)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          size="sm"
          className="flex-1 font-medium"
          onClick={onConfirm}
          disabled={isSubmitting || !payload}
        >
          {isSubmitting ? (
            <>
              <Spinner className="size-4" />
              Guardando...
            </>
          ) : (
            "Sí, guardar cambios"
          )}
        </Button>
      </div>
    </BaseModal>
  );
};
