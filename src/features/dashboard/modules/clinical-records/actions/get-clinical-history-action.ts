'use server'

import { serverApi } from "@/lib/api/server";
import { handleApiError } from "@/lib/api/error-handler";
import { parseFilenameFromContentDisposition } from "@/utils";
import { IGetClinicalHistoryResponse } from "../interfaces";

export type TGetClinicalHistoryParams = {
    IdPatient: number;
    From?: string;
    To?: string;
}

export const apiGetClinicalHistoryAction = async (params: TGetClinicalHistoryParams): Promise<IGetClinicalHistoryResponse> => {
    const CLINICAL_RECORD = process.env.CLINICAL_RECORD;
    const GET_CLINICAL_HISTORY = process.env.GET_CLINICAL_HISTORY;

    const { IdPatient, From, To } = params;

    const query = new URLSearchParams();

    query.append("IdPatient", IdPatient.toString());
    if (From) query.append("From", From);
    if (To) query.append("To", To);

    const url = `${CLINICAL_RECORD}${GET_CLINICAL_HISTORY}?${query.toString()}`;

    try {
        const response = await serverApi.get<Blob>(url);

        const disposition = response.headers.get("Content-Disposition");
        const filename = parseFilenameFromContentDisposition(disposition);

        return {
            success: true,
            message: "Historia clínica exportada correctamente",
            data: response.data,
            filename: filename
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