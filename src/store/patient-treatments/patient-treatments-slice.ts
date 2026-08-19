import { createAppSlice } from "../slice";
import {
  apiGetPatientTreatmentsAction,
  TGetPatientTreatmentsParams,
  apiPostCreatePatientTreatmentAction,
  apiPutUpdatePatientTreatmentAction,
} from "@/features/dashboard/modules/patient-treatments/actions";
import {
  IGetPatientTreatmentsResponseData,
  IPostCreatePatientTreatmentFormRequest,
  IPutUpdatePatientTreatmentFormRequest,
} from "@/features/dashboard/modules/patient-treatments/interfaces";
import { TStatus } from "@/types";

type TPatientTreatmentsState = {
  getPatientTreatments: {
    status: TStatus;
    message?: string;
    data?: IGetPatientTreatmentsResponseData;
  };
  postCreatePatientTreatment: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  putUpdatePatientTreatment: {
    status: TStatus;
    message?: string;
    error?: string;
  };
};

const initialState: TPatientTreatmentsState = {
  getPatientTreatments: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
  postCreatePatientTreatment: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  putUpdatePatientTreatment: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
};

const patientTreatmentsSlice = createAppSlice({
  name: "patientTreatments",
  initialState,
  reducers: (create) => ({
    getPatientTreatments: create.asyncThunk(
      async (params?: TGetPatientTreatmentsParams) =>
        await apiGetPatientTreatmentsAction(params),
      {
        pending: (state) => {
          state.getPatientTreatments.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getPatientTreatments.status = "error";
            state.getPatientTreatments.message = action.payload.message;
            state.getPatientTreatments.data = undefined;
            return;
          }
          state.getPatientTreatments.status = "success";
          state.getPatientTreatments.message = action.payload.message;
          state.getPatientTreatments.data = action.payload.data ?? undefined;
        },
        rejected: (state, action) => {
          state.getPatientTreatments.status = "error";
          state.getPatientTreatments.message = action.error.message;
          state.getPatientTreatments.data = undefined;
        },
      },
    ),
    postCreatePatientTreatment: create.asyncThunk(
      async (data: IPostCreatePatientTreatmentFormRequest) =>
        await apiPostCreatePatientTreatmentAction(data),
      {
        pending: (state) => {
          state.postCreatePatientTreatment.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreatePatientTreatment.status = "error";
            state.postCreatePatientTreatment.message = action.payload.message;
            state.postCreatePatientTreatment.error =
              action.payload.error ?? undefined;
            return;
          }
          state.postCreatePatientTreatment.status = "success";
          state.postCreatePatientTreatment.message = action.payload.message;
          state.postCreatePatientTreatment.error = undefined;
        },
        rejected: (state, action) => {
          state.postCreatePatientTreatment.status = "error";
          state.postCreatePatientTreatment.message = action.error.message;
          state.postCreatePatientTreatment.error = undefined;
        },
      },
    ),
    resetPostCreatePatientTreatment: create.reducer((state) => {
      state.postCreatePatientTreatment = initialState.postCreatePatientTreatment;
    }),
    putUpdatePatientTreatment: create.asyncThunk(
      async (data: IPutUpdatePatientTreatmentFormRequest) =>
        await apiPutUpdatePatientTreatmentAction(data),
      {
        pending: (state) => {
          state.putUpdatePatientTreatment.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.putUpdatePatientTreatment.status = "error";
            state.putUpdatePatientTreatment.message = action.payload.message;
            state.putUpdatePatientTreatment.error =
              action.payload.error ?? undefined;
            return;
          }
          state.putUpdatePatientTreatment.status = "success";
          state.putUpdatePatientTreatment.message = action.payload.message;
          state.putUpdatePatientTreatment.error = undefined;
        },
        rejected: (state, action) => {
          state.putUpdatePatientTreatment.status = "error";
          state.putUpdatePatientTreatment.message = action.error.message;
          state.putUpdatePatientTreatment.error = undefined;
        },
      },
    ),
    resetPutUpdatePatientTreatment: create.reducer((state) => {
      state.putUpdatePatientTreatment = initialState.putUpdatePatientTreatment;
    }),
  }),
  selectors: {
    selectGetPatientTreatments: (state) => state.getPatientTreatments,
    selectPostCreatePatientTreatment: (state) =>
      state.postCreatePatientTreatment,
    selectPutUpdatePatientTreatment: (state) =>
      state.putUpdatePatientTreatment,
  },
});

export const {
  getPatientTreatments,
  postCreatePatientTreatment,
  resetPostCreatePatientTreatment,
  putUpdatePatientTreatment,
  resetPutUpdatePatientTreatment,
} = patientTreatmentsSlice.actions;
export const {
  selectGetPatientTreatments,
  selectPostCreatePatientTreatment,
  selectPutUpdatePatientTreatment,
} = patientTreatmentsSlice.selectors;
export default patientTreatmentsSlice.reducer;
