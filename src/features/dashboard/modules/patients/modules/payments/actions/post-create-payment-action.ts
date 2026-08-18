"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { TBaseResponse } from "@/types";
import { IPostCreatePaymentFormRequest } from "../interfaces";

export const apiPostCreatePaymentAction = async (
  data: IPostCreatePaymentFormRequest,
): Promise<TBaseResponse<boolean>> => {
  const PAYMENT = process.env.PAYMENT;
  const POST_CREATE_PAYMENT = process.env.POST_CREATE_PAYMENT;

  const idAppointment = data.idAppointment ?? null;
  const idPatientTreatment = data.idPatientTreatment ?? null;

  if (Boolean(idAppointment) === Boolean(idPatientTreatment)) {
    return {
      success: false,
      message:
        "El pago debe asociarse exactamente a una cita o a un tratamiento del paciente.",
    };
  }

  try {
    const response = await serverApi.post<TBaseResponse<boolean>>(
      `${PAYMENT}${POST_CREATE_PAYMENT}`,
      {
        idPatient: data.idPatient,
        idAppointment,
        idPatientTreatment,
        amount: data.amount,
        paidAt: data.paidAt,
        idPaymentMethod: data.idPaymentMethod,
        notes: data.notes ?? null,
      },
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const { message, error: errorResponse } = await handleApiError(error);
    return {
      success: false,
      message,
      error: errorResponse,
    };
  }
};
