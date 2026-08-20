"use server";

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { parseFilenameFromContentDisposition } from "@/utils";
import { IGetPaymentsReportResponse } from "../interfaces";

export type TGetPaymentsReportParams = {
  From?: string;
  To?: string;
  IdPatient?: number;
  IdAppointment?: number;
  IdPatientTreatment?: number;
};

export const apiGetPaymentsReportAction = async (
  params: TGetPaymentsReportParams = {},
): Promise<IGetPaymentsReportResponse> => {
  const PAYMENT = process.env.PAYMENT;
  const GET_PAYMENTS_REPORT = process.env.GET_PAYMENTS_REPORT;

  const { From, To, IdPatient, IdAppointment, IdPatientTreatment } = params;

  const filters = [
    Boolean(IdPatient),
    Boolean(IdAppointment),
    Boolean(IdPatientTreatment),
  ].filter(Boolean).length;

  if (filters > 1) {
    return {
      success: false,
      message:
        "Indique como máximo un filtro: paciente, cita o tratamiento del paciente.",
    };
  }

  const query = new URLSearchParams();
  if (From) query.append("From", From);
  if (To) query.append("To", To);
  if (IdPatient) query.append("IdPatient", IdPatient.toString());
  if (IdAppointment) query.append("IdAppointment", IdAppointment.toString());
  if (IdPatientTreatment) {
    query.append("IdPatientTreatment", IdPatientTreatment.toString());
  }

  const url = `${PAYMENT}${GET_PAYMENTS_REPORT}?${query.toString()}`;

  try {
    const response = await serverApi.get<Blob>(url);
    const disposition = response.headers.get("Content-Disposition");
    const filename = parseFilenameFromContentDisposition(disposition);

    return {
      success: true,
      message: "Reporte de pagos exportado correctamente",
      data: response.data,
      filename,
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
