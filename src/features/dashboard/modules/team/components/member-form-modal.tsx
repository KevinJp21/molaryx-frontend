"use client";

import { useEffect } from "react";
import { UserPlus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  BaseModal,
  Button,
  CustomFormField,
  CustomFormSelect,
  Spinner,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getIdentificationTypes,
  selectGetIdentificationTypes,
} from "@/store/masters/masters-slice";
import {
  postCreateMember,
  resetPostCreateMember,
  selectPostCreateMember,
} from "@/store/team/team-slice";
import { TEAM_ROLE_FILTER_OPTIONS } from "../consts";
import {
  MEMBER_FORM_DEFAULT_VALUES,
  MemberFormSchema,
  TMemberForm,
} from "../schemas";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onSuccess?: () => void;
};

export const MemberFormModal = ({ open, onOpenChange, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector(selectGetIdentificationTypes);
  const {
    status: postCreateMemberStatus,
    message: postCreateMemberMessage,
    error: postCreateMemberError,
  } = useAppSelector(selectPostCreateMember);
  const isLoadingTypes = status === "loading" || status === "idle";
  const isSubmitting = postCreateMemberStatus === "loading";
  const identificationTypes = (data && status === "success" ? data : []).filter(
    (item) => ![3,4].includes(item.idIdentificationType),
  );

  const methods = useForm<TMemberForm>({
    mode: "onTouched",
    resolver: zodResolver(MemberFormSchema),
    defaultValues: MEMBER_FORM_DEFAULT_VALUES,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (open && status !== "success") {
      dispatch(getIdentificationTypes());
    }
  }, [open, status, dispatch]);

  useEffect(() => {
    if (open) {
      reset(MEMBER_FORM_DEFAULT_VALUES);
    }
  }, [open, reset]);

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      reset(MEMBER_FORM_DEFAULT_VALUES);
      if (postCreateMemberStatus !== "idle") {
        dispatch(resetPostCreateMember());
      }
    }
    onOpenChange(next);
  };

  const onSubmit = (data: TMemberForm) => {
    dispatch(
      postCreateMember({
        ...data,
        secondName: data.secondName?.trim() ? data.secondName.trim() : null,
        secondSurname: data.secondSurname?.trim()
          ? data.secondSurname.trim()
          : null,
      }),
    );
  };

  useEffect(() => {
    if (postCreateMemberStatus === "error") {
      toast.error(postCreateMemberMessage, {
        description: postCreateMemberError,
      });
      dispatch(resetPostCreateMember());
    }
    if (postCreateMemberStatus === "success") {
      toast.success(postCreateMemberMessage);
      handleDialogOpenChange(false);
      dispatch(resetPostCreateMember());
      onSuccess?.();
    }
  }, [postCreateMemberStatus, dispatch]);

  return (
    <BaseModal
      open={open}
      onOpenChange={handleDialogOpenChange}
      icon={<UserPlus className="size-3.5" strokeWidth={2} />}
      title="Nuevo miembro"
      description="Datos de cuenta, identificación y contacto."
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormSelect
                  name="idUserRole"
                  label="Rol"
                  placeholder="Selecciona un rol"
                  items={TEAM_ROLE_FILTER_OPTIONS.map((role) => ({
                    name: role.label,
                    value: role.value,
                  }))}
                />
                <CustomFormField
                  name="username"
                  label="Usuario"
                  placeholder="Ingresa el usuario"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField
                  name="firstName"
                  label="Nombre"
                  placeholder="Ingresa el nombre"
                />
                <CustomFormField
                  name="secondName"
                  label="Segundo nombre (opcional)"
                  placeholder="Ingresa el segundo nombre"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField
                  name="firstSurname"
                  label="Apellido"
                  placeholder="Ingresa el apellido"
                />
                <CustomFormField
                  name="secondSurname"
                  label="Segundo apellido (opcional)"
                  placeholder="Ingresa el segundo apellido"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormSelect
                  items={identificationTypes.map((item) => ({
                    name: `${item.name} (${item.code})`,
                    value: item.idIdentificationType,
                  }))}
                  name="idIdentificationType"
                  label="Tipo de identificación"
                  placeholder={isLoadingTypes ? "Cargando..." : "Selecciona un tipo"}
                  disabled={isLoadingTypes}
                />
                <CustomFormField
                  name="identificationNumber"
                  label="Número de identificación"
                  placeholder="Ingresa el número de identificación"
                  type="text"
                  mode="digits"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField
                  name="birthDate"
                  label="Fecha de nacimiento"
                  placeholder="Selecciona la fecha"
                  type="date"
                />
                <CustomFormField
                  name="phoneNumber"
                  label="Número de teléfono"
                  placeholder="Ingresa el teléfono"
                  type="text"
                  mode="digits"
                />
              </div>
              <CustomFormField
                name="email"
                label="Correo electrónico"
                placeholder="Ingresa el correo"
                type="email"
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-ink-800 bg-ink-900/40 px-5 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDialogOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  Guardando miembro...
                </>
              ) : (
                "Guardar miembro"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
};
