"use client";

import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BaseModal,
  Button,
  CustomFormField,
  CustomFormSelect,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getIdentificationTypes,
  selectGetIdentificationTypes,
} from "@/store/masters/masters-slice";
import { colombiaToUtcIso, formatDate } from "@/utils";
import {
  TENANT_STATUS_OPTION,
  TENANT_SUBSCRIPTION_STATUS_OPTION,
  USER_STATUS_OPTION,
} from "../consts";
import type { IPutUpdateTenantRequest, ITenantsItems } from "../interfaces";
import {
  UPDATE_TENANT_FORM_DEFAULT_VALUES,
  UpdateTenantFormSchema,
  type TUpdateTenantForm,
  type TUpdateTenantFormValues,
} from "../schemas";
import { splitOwnerDisplayName } from "../utils";
import { ConfirmUpdateTenantModal } from "./confirm-update-tenant-modal";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  tenant: ITenantsItems | null;
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
    <h3 className="text-sm font-medium text-ink-50">{title}</h3>
    <p className="mt-0.5 text-xs text-ink-400">{description}</p>
  </div>
);

const toDatetimeLocal = (value?: string | null) => {
  if (!value) return "";
  return formatDate(value, "yyyy-MM-dd'T'HH:mm");
};

const toFormValues = (tenant?: ITenantsItems | null): TUpdateTenantForm => {
  if (!tenant) return UPDATE_TENANT_FORM_DEFAULT_VALUES;

  const ownerParts = splitOwnerDisplayName(tenant.owner?.name);

  return {
    tenant: {
      idIdentificationType: tenant.idIdentificationType,
      identificationNumber: tenant.identificationNumber ?? "",
      consultoryName: tenant.consultoryName,
      email: tenant.email,
      phoneNumber: tenant.phoneNumber,
      address: tenant.address,
      idTenantStatus: tenant.idTenantStatus,
    },
    owner: tenant.owner
      ? {
          idUser: tenant.owner.idUser,
          username: tenant.owner.username,
          firstName: ownerParts.firstName,
          secondName: ownerParts.secondName,
          firstSurname: ownerParts.firstSurname,
          secondSurname: ownerParts.secondSurname,
          idIdentificationType: tenant.owner.idIdentificationType,
          identificationNumber: tenant.owner.identificationNumber,
          phoneNumber: tenant.owner.phoneNumber,
          email: tenant.owner.email,
          idUserStatus: tenant.owner.idUserStatus,
        }
      : null,
    subscription: tenant.subscription
      ? {
          idTenantSubscription: tenant.subscription.idTenantSubscription,
          idTenantSubscriptionStatus:
            tenant.subscription.idTenantSubscriptionStatus,
          price: tenant.subscription.price,
          maxProfessionals: tenant.subscription.maxProfessionals,
          maxAssistants: tenant.subscription.maxAssistants,
          maxPatients: tenant.subscription.maxPatients,
          startsAt: toDatetimeLocal(tenant.subscription.startsAt),
          endsAt: toDatetimeLocal(tenant.subscription.endsAt),
        }
      : null,
  };
};

const toUpdatePayload = (
  tenant: ITenantsItems,
  values: TUpdateTenantFormValues,
): IPutUpdateTenantRequest => {
  const owner = values.owner;
  const subscription = values.subscription;

  return {
    idTenant: tenant.idTenant,
    tenant: {
      idIdentificationType: values.tenant.idIdentificationType,
      identificationNumber: values.tenant.identificationNumber.trim() || null,
      consultoryName: values.tenant.consultoryName.trim(),
      email: values.tenant.email.trim(),
      phoneNumber: values.tenant.phoneNumber.trim(),
      address: values.tenant.address.trim(),
      idTenantStatus: values.tenant.idTenantStatus,
    },
    owner:
      owner && owner.idUser != null
        ? {
            idUser: owner.idUser,
            username: owner.username.trim(),
            firstName: owner.firstName.trim(),
            secondName: owner.secondName,
            firstSurname: owner.firstSurname.trim(),
            secondSurname: owner.secondSurname,
            idIdentificationType: owner.idIdentificationType,
            identificationNumber: owner.identificationNumber.trim(),
            phoneNumber: owner.phoneNumber.trim(),
            email: owner.email.trim(),
            idUserStatus: owner.idUserStatus,
          }
        : null,
    subscription: subscription
      ? {
          idTenantSubscription: subscription.idTenantSubscription,
          idTenantSubscriptionStatus: subscription.idTenantSubscriptionStatus,
          price: subscription.price,
          maxProfessionals: subscription.maxProfessionals,
          maxAssistants: subscription.maxAssistants,
          maxPatients: subscription.maxPatients,
          startsAt: subscription.startsAt
            ? colombiaToUtcIso(subscription.startsAt)
            : null,
          endsAt: subscription.endsAt
            ? colombiaToUtcIso(subscription.endsAt)
            : null,
        }
      : null,
  };
};

export const UpdateTenantFormModal = ({
  open,
  onOpenChange,
  tenant,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status: typesStatus } = useAppSelector(
    selectGetIdentificationTypes,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<IPutUpdateTenantRequest | null>(null);

  const isLoadingTypes = typesStatus === "loading" || typesStatus === "idle";

  const tenantIdentificationTypes = (
    data && typesStatus === "success" ? data : []
  ).filter((item) => ![3].includes(item.idIdentificationType));

  const ownerIdentificationTypes = (
    data && typesStatus === "success" ? data : []
  ).filter((item) => ![3, 4].includes(item.idIdentificationType));

  const statusOptions = TENANT_STATUS_OPTION;

  const methods = useForm<
    TUpdateTenantForm,
    unknown,
    TUpdateTenantFormValues
  >({
    mode: "onTouched",
    resolver: zodResolver(UpdateTenantFormSchema),
    defaultValues: UPDATE_TENANT_FORM_DEFAULT_VALUES,
  });

  const { reset, handleSubmit, trigger, watch } = methods;
  const hasOwner = Boolean(watch("owner"));
  const hasSubscription = Boolean(watch("subscription"));

  useEffect(() => {
    if (open && typesStatus !== "success") {
      dispatch(getIdentificationTypes());
    }
  }, [open, typesStatus, dispatch]);

  useEffect(() => {
    if (open) {
      reset(toFormValues(tenant));
      setPendingPayload(null);
      setConfirmOpen(false);
    }
  }, [open, tenant, reset]);

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      reset(UPDATE_TENANT_FORM_DEFAULT_VALUES);
      setPendingPayload(null);
      setConfirmOpen(false);
    }
    onOpenChange(next);
  };

  const onSubmit = (values: TUpdateTenantFormValues) => {
    if (!tenant) return;
    setPendingPayload(toUpdatePayload(tenant, values));
    setConfirmOpen(true);
  };

  const handleConfirmSuccess = () => {
    handleDialogOpenChange(false);
    onSuccess?.();
  };

  return (
    <>
      <BaseModal
        open={open}
        onOpenChange={handleDialogOpenChange}
        icon={<SquarePen className="size-3.5" strokeWidth={2} />}
        title="Editar tenant"
        description="Actualiza los datos del consultorio, propietario y suscripción."
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
                    title="Consultorio"
                    description="Datos de identificación, contacto y estado."
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
                          isLoadingTypes ? "Cargando..." : "Selecciona un tipo"
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
                    <CustomFormSelect
                      name="tenant.idTenantStatus"
                      label="Estado"
                      placeholder="Selecciona un estado"
                      items={statusOptions}
                    />
                  </div>
                </section>

                <section>
                  <SectionTitle
                    title="Propietario"
                    description="Usuario administrador principal del consultorio."
                  />
                  {hasOwner ? (
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
                          name="owner.phoneNumber"
                          label="Teléfono"
                          placeholder="3123456789"
                          type="text"
                          mode="digits"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CustomFormField
                          name="owner.email"
                          label="Correo electrónico"
                          placeholder="ejemplo@correo.com"
                          type="email"
                        />
                        <CustomFormSelect
                          name="owner.idUserStatus"
                          label="Estado del usuario"
                          placeholder="Selecciona un estado"
                          items={USER_STATUS_OPTION.map((option) => ({
                            name: option.name,
                            value: option.value,
                          }))}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-ink-400">
                      Sin propietario registrado. Solo se actualizarán
                      consultorio y suscripción.
                    </p>
                  )}
                </section>

                <section>
                  <SectionTitle
                    title="Suscripción"
                    description="Plan, cupos, fechas y estado de la suscripción."
                  />
                  {hasSubscription ? (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CustomFormSelect
                          name="subscription.idTenantSubscriptionStatus"
                          label="Estado de suscripción"
                          placeholder="Selecciona un estado"
                          items={TENANT_SUBSCRIPTION_STATUS_OPTION.map(
                            (option) => ({
                              name: option.name,
                              value: option.value,
                            }),
                          )}
                        />
                        <CustomFormField
                          name="subscription.price"
                          label="Precio"
                          placeholder="0"
                          mode="currency"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <CustomFormField
                          name="subscription.maxProfessionals"
                          label="Máx. profesionales"
                          placeholder="1"
                          mode="number"
                        />
                        <CustomFormField
                          name="subscription.maxAssistants"
                          label="Máx. asistentes"
                          placeholder="1"
                          mode="number"
                        />
                        <CustomFormField
                          name="subscription.maxPatients"
                          label="Máx. pacientes"
                          placeholder="100"
                          mode="number"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CustomFormField
                          name="subscription.startsAt"
                          label="Inicio"
                          type="datetime"
                          placeholder="Selecciona la fecha de inicio"
                        />
                        <CustomFormField
                          name="subscription.endsAt"
                          label="Fin"
                          type="datetime"
                          placeholder="Selecciona la fecha de fin"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-ink-400">
                      Sin suscripción registrada.
                    </p>
                  )}
                </section>
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
              <Button type="submit" size="sm">
                Guardar cambios
              </Button>
            </div>
          </form>
        </FormProvider>
      </BaseModal>

      <ConfirmUpdateTenantModal
        open={confirmOpen}
        onOpenChange={(next) => {
          setConfirmOpen(next);
          if (!next) setPendingPayload(null);
        }}
        tenantName={tenant?.consultoryName ?? "Tenant"}
        payload={pendingPayload}
        onSuccess={handleConfirmSuccess}
      />
    </>
  );
};
