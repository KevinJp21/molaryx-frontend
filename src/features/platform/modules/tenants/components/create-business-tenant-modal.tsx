"use client";

import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  BaseModal,
  Button,
  CustomFormField,
  CustomFormSelect,
  CustomPasswordFormField,
  Spinner,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getIdentificationTypes,
  selectGetIdentificationTypes,
} from "@/store/masters/masters-slice";
import {
  postCreateBusinessTenant,
  resetPostCreateBusinessTenant,
  selectPostCreateBusinessTenant,
} from "@/store/tenants/tenants-slice";
import {
  CREATE_BUSINESS_TENANT_FORM_DEFAULT_VALUES,
  CreateBusinessTenantFormSchema,
  type TCreateBusinessTenantForm,
  type TCreateBusinessTenantFormValues,
} from "../schemas";
import type { IPostCreateBusinessTenantRequest } from "../interfaces";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onSuccess?: () => void;
};

const SectionTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="mb-3">
    <h3 className="text-sm font-medium text-ink-950">{title}</h3>
    <p className="mt-0.5 text-xs text-ink-600">{description}</p>
  </div>
);

export const CreateBusinessTenantModal = ({
  open,
  onOpenChange,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status: typesStatus } = useAppSelector(
    selectGetIdentificationTypes,
  );
  const {
    status: createStatus,
    message: createMessage,
    error: createError,
  } = useAppSelector(selectPostCreateBusinessTenant);

  const isLoadingTypes = typesStatus === "loading" || typesStatus === "idle";
  const isSubmitting = createStatus === "loading";

  const tenantIdentificationTypes = (
    data && typesStatus === "success" ? data : []
  ).filter((item) => ![3].includes(item.idIdentificationType));

  const ownerIdentificationTypes = (
    data && typesStatus === "success" ? data : []
  ).filter((item) => ![3, 4].includes(item.idIdentificationType));

  const methods = useForm<
    TCreateBusinessTenantForm,
    unknown,
    TCreateBusinessTenantFormValues
  >({
    mode: "onTouched",
    resolver: zodResolver(CreateBusinessTenantFormSchema),
    defaultValues: CREATE_BUSINESS_TENANT_FORM_DEFAULT_VALUES,
  });

  const { reset, handleSubmit, trigger } = methods;

  useEffect(() => {
    if (open && typesStatus !== "success") {
      dispatch(getIdentificationTypes());
    }
  }, [open, typesStatus, dispatch]);

  useEffect(() => {
    if (open) {
      reset(CREATE_BUSINESS_TENANT_FORM_DEFAULT_VALUES);
    }
  }, [open, reset]);

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      reset(CREATE_BUSINESS_TENANT_FORM_DEFAULT_VALUES);
      if (createStatus !== "idle") {
        dispatch(resetPostCreateBusinessTenant());
      }
    }
    onOpenChange(next);
  };

  const onSubmit = (values: TCreateBusinessTenantFormValues) => {
    const { confirmPassword: _confirmPassword, ...owner } = values.owner;
    const { price, maxProfessionals, maxAssistants, maxPatients } = values.plan;

    if (
      price == null ||
      maxProfessionals == null ||
      maxAssistants == null ||
      maxPatients == null
    ) {
      return;
    }

    const payload: IPostCreateBusinessTenantRequest = {
      plan: {
        price,
        maxProfessionals,
        maxAssistants,
        maxPatients,
      },
      tenant: {
        idIdentificationType: values.tenant.idIdentificationType,
        identificationNumber: values.tenant.identificationNumber,
        consultoryName: values.tenant.consultoryName.trim(),
        email: values.tenant.email.trim(),
        phoneNumber: values.tenant.phoneNumber.trim(),
        address: values.tenant.address.trim(),
      },
      owner: {
        ...owner,
        username: owner.username.trim(),
        firstName: owner.firstName.trim(),
        firstSurname: owner.firstSurname.trim(),
        identificationNumber: owner.identificationNumber.trim(),
        phoneNumber: owner.phoneNumber.trim(),
        email: owner.email.trim(),
      },
    };

    dispatch(postCreateBusinessTenant(payload));
  };

  useEffect(() => {
    if (createStatus === "error") {
      toast.error(createMessage ?? "No se pudo crear la cuenta Business.", {
        description: createError,
      });
      dispatch(resetPostCreateBusinessTenant());
    }
    if (createStatus === "success") {
      toast.success(
        createMessage ?? "Cuenta Business creada de manera exitosa.",
      );
      handleDialogOpenChange(false);
      dispatch(resetPostCreateBusinessTenant());
      onSuccess?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync con status de creación
  }, [createStatus, dispatch, createMessage, createError]);

  return (
    <BaseModal
      open={open}
      onOpenChange={handleDialogOpenChange}
      icon={<Building2 className="size-3.5" strokeWidth={2} />}
      title="Nuevo tenant Business"
      description="Crea un consultorio con plan Business personalizado."
      className="max-w-3xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-6">
              <section>
                <SectionTitle
                  title="Plan Business"
                  description="Define el precio y los cupos del plan personalizado."
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CustomFormField
                    name="plan.price"
                    label="Precio"
                    placeholder="0"
                    mode="currency"
                  />
                  <CustomFormField
                    name="plan.maxProfessionals"
                    label="Máx. profesionales"
                    placeholder="1"
                    mode="number"
                  />
                  <CustomFormField
                    name="plan.maxAssistants"
                    label="Máx. asistentes"
                    placeholder="1"
                    mode="number"
                  />
                  <CustomFormField
                    name="plan.maxPatients"
                    label="Máx. pacientes"
                    placeholder="100"
                    mode="number"
                  />
                </div>
              </section>

              <section>
                <SectionTitle
                  title="Consultorio"
                  description="Datos de identificación y contacto del tenant."
                />
                <div className="flex flex-col gap-3">
                  <CustomFormField
                    name="tenant.consultoryName"
                    label="Nombre del consultorio"
                    placeholder="Consultorio Odontológico Sonrisa"
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomFormSelect
                      items={tenantIdentificationTypes.map((item) => ({
                        name: `${item.name} (${item.code})`,
                        value: item.idIdentificationType,
                      }))}
                      name="tenant.idIdentificationType"
                      label="Tipo de identificación"
                      placeholder={
                        isLoadingTypes
                          ? "Cargando..."
                          : "Selecciona un tipo"
                      }
                      disabled={isLoadingTypes}
                      onChange={() => {
                        void trigger("tenant.identificationNumber");
                      }}
                    />
                    <CustomFormField
                      name="tenant.identificationNumber"
                      label="Número de identificación"
                      placeholder="1234567890"
                      type="text"
                      mode="digits"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomFormField
                      name="tenant.email"
                      label="Correo electrónico"
                      placeholder="ejemplo@correo.com"
                      type="email"
                    />
                    <CustomFormField
                      name="tenant.phoneNumber"
                      label="Teléfono"
                      placeholder="3123456789"
                      type="text"
                      mode="digits"
                    />
                  </div>
                  <CustomFormField
                    name="tenant.address"
                    label="Dirección"
                    placeholder="Calle 123, Ciudad"
                  />
                </div>
              </section>

              <section>
                <SectionTitle
                  title="Propietario"
                  description="Usuario administrador principal del consultorio."
                />
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomFormField
                      name="owner.firstName"
                      label="Nombre"
                      placeholder="Ingresa el nombre"
                    />
                    <CustomFormField
                      name="owner.secondName"
                      label="Segundo nombre (opcional)"
                      placeholder="Ingresa el segundo nombre"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomFormField
                      name="owner.firstSurname"
                      label="Apellido"
                      placeholder="Ingresa el apellido"
                    />
                    <CustomFormField
                      name="owner.secondSurname"
                      label="Segundo apellido (opcional)"
                      placeholder="Ingresa el segundo apellido"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomFormSelect
                      items={ownerIdentificationTypes.map((item) => ({
                        name: `${item.name} (${item.code})`,
                        value: item.idIdentificationType,
                      }))}
                      name="owner.idIdentificationType"
                      label="Tipo de identificación"
                      placeholder={
                        isLoadingTypes
                          ? "Cargando..."
                          : "Selecciona un tipo"
                      }
                      disabled={isLoadingTypes}
                      onChange={() => {
                        void trigger("owner.identificationNumber");
                      }}
                    />
                    <CustomFormField
                      name="owner.identificationNumber"
                      label="Número de identificación"
                      placeholder="Ingresa el número"
                      type="text"
                      mode="digits"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomFormField
                      name="owner.username"
                      label="Nombre de usuario"
                      placeholder="usuario.molaryx"
                    />
                    <CustomFormField
                      name="owner.birthDate"
                      label="Fecha de nacimiento"
                      placeholder="Selecciona la fecha"
                      type="date"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomFormField
                      name="owner.phoneNumber"
                      label="Teléfono"
                      placeholder="3123456789"
                      type="text"
                      mode="digits"
                    />
                    <CustomFormField
                      name="owner.email"
                      label="Correo electrónico"
                      placeholder="ejemplo@correo.com"
                      type="email"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomPasswordFormField
                      name="owner.password"
                      label="Contraseña"
                    />
                    <CustomPasswordFormField
                      name="owner.confirmPassword"
                      label="Confirmar contraseña"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-ink-200 bg-ink-100/40 px-5 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDialogOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  Creando cuenta...
                </>
              ) : (
                "Crear tenant Business"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
};
