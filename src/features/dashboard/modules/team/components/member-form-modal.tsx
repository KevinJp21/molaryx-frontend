"use client";

import { useEffect } from "react";
import { SquarePen, UserPlus } from "lucide-react";
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
  putUpdateMember,
  resetPostCreateMember,
  resetPutUpdateMember,
  selectPostCreateMember,
  selectPutUpdateMember,
} from "@/store/team/team-slice";
import { TEAM_ROLE_FILTER_OPTIONS } from "../consts";
import { IGetTeamResponseData } from "../interfaces";
import {
  MEMBER_FORM_DEFAULT_VALUES,
  MemberFormSchema,
  TMemberForm,
} from "../schemas";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  member?: IGetTeamResponseData | null;
  onSuccess?: () => void;
};

const toOptionalName = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const toFormValues = (member?: IGetTeamResponseData | null): TMemberForm => {
  if (!member) return MEMBER_FORM_DEFAULT_VALUES;

  return {
    idUserRole: member.idUserRole,
    username: member.username,
    idIdentificationType: member.idIdentificationType,
    identificationNumber: member.identificationNumber,
    firstName: member.firstName,
    secondName: toOptionalName(member.secondName),
    firstSurname: member.firstSurname,
    secondSurname: toOptionalName(member.secondSurname),
    birthDate: member.birthDate.slice(0, 10),
    phoneNumber: member.phoneNumber,
    email: member.email,
  };
};

export const MemberFormModal = ({
  open,
  onOpenChange,
  member = null,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const isEdit = Boolean(member);
  const { data, status } = useAppSelector(selectGetIdentificationTypes);
  const {
    status: postCreateMemberStatus,
    message: postCreateMemberMessage,
    error: postCreateMemberError,
  } = useAppSelector(selectPostCreateMember);
  const {
    status: putUpdateMemberStatus,
    message: putUpdateMemberMessage,
    error: putUpdateMemberError,
  } = useAppSelector(selectPutUpdateMember);
  const isLoadingTypes = status === "loading" || status === "idle";
  const isSubmitting = isEdit
    ? putUpdateMemberStatus === "loading"
    : postCreateMemberStatus === "loading";
  const identificationTypes = (data && status === "success" ? data : []).filter(
    (item) => ![3, 4].includes(item.idIdentificationType),
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
      reset(toFormValues(member));
    }
  }, [open, member, reset]);

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      reset(MEMBER_FORM_DEFAULT_VALUES);
      if (isEdit) {
        if (putUpdateMemberStatus !== "idle") {
          dispatch(resetPutUpdateMember());
        }
      } else if (postCreateMemberStatus !== "idle") {
        dispatch(resetPostCreateMember());
      }
    }
    onOpenChange(next);
  };

  const onSubmit = (data: TMemberForm) => {
    const payload = {
      ...data,
      secondName: data.secondName?.trim() ? data.secondName.trim() : null,
      secondSurname: data.secondSurname?.trim()
        ? data.secondSurname.trim()
        : null,
    };

    if (isEdit && member) {
      const { idUserRole: _idUserRole, ...updateData } = payload;
      dispatch(
        putUpdateMember({
          ...updateData,
          idUser: member.idUser,
        }),
      );
      return;
    }

    dispatch(postCreateMember(payload));
  };

  useEffect(() => {
    if (isEdit) return;

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
  }, [postCreateMemberStatus, isEdit, dispatch]);

  useEffect(() => {
    if (!isEdit) return;

    if (putUpdateMemberStatus === "error") {
      toast.error(putUpdateMemberMessage, {
        description: putUpdateMemberError,
      });
      dispatch(resetPutUpdateMember());
    }
    if (putUpdateMemberStatus === "success") {
      toast.success(putUpdateMemberMessage);
      handleDialogOpenChange(false);
      dispatch(resetPutUpdateMember());
      onSuccess?.();
    }
  }, [putUpdateMemberStatus, isEdit, dispatch]);

  return (
    <BaseModal
      open={open}
      onOpenChange={handleDialogOpenChange}
      icon={
        isEdit ? (
          <SquarePen className="size-3.5" strokeWidth={2} />
        ) : (
          <UserPlus className="size-3.5" strokeWidth={2} />
        )
      }
      title={isEdit ? "Editar miembro" : "Nuevo miembro"}
      description={
        isEdit
          ? "Actualiza los datos del miembro. El rol no se puede cambiar."
          : "Datos de cuenta, identificación y contacto."
      }
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
                  disabled={isEdit}
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
                  placeholder={
                    isLoadingTypes ? "Cargando..." : "Selecciona un tipo"
                  }
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

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-ink-200 bg-ink-100/40 px-5 py-3">
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
                  {isEdit ? "Guardando cambios..." : "Guardando miembro..."}
                </>
              ) : isEdit ? (
                "Guardar cambios"
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
