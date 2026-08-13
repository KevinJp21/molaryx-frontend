import { createAppSlice } from "../slice";
import {
  apiGetPatientsAction,
  IGetPatientsResponseData,
  TGetPatientsParams,
  apiPostCreatePatientAction,
  IPostCreatePatientFormRequest,
} from "@/features";
import { TStatus } from "@/types";

type TPatientsState = {
  postCreatePatient: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  getPatients: {
    status: TStatus;
    message?: string;
    data?: IGetPatientsResponseData;
  };
};

const initialState: TPatientsState = {
  postCreatePatient: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  getPatients: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
};

const patientsSlice = createAppSlice({
  name: "patients",
  initialState,
  reducers: (create) => ({
    getPatients: create.asyncThunk(
      async (params?: TGetPatientsParams) => await apiGetPatientsAction(params),
      {
        pending: (state) => {
          state.getPatients.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getPatients.status = "error";
            state.getPatients.message = action.payload.message;
            state.getPatients.data = undefined;
            return;
          }
          state.getPatients.status = "success";
          state.getPatients.message = action.payload.message;
          state.getPatients.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.getPatients.status = "error";
          state.getPatients.message = action.error.message;
          state.getPatients.data = undefined;
        },
      },
    ),
    postCreatePatient: create.asyncThunk(
      async (data: IPostCreatePatientFormRequest) =>
        await apiPostCreatePatientAction(data),
      {
        pending: (state) => {
          state.postCreatePatient.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreatePatient.status = "error";
            state.postCreatePatient.message = action.payload.message;
            state.postCreatePatient.error = action.payload.error ?? undefined;
            return;
          }
          state.postCreatePatient.status = "success";
          state.postCreatePatient.message = action.payload.message;
          state.postCreatePatient.error = undefined;
        },
        rejected: (state, action) => {
          state.postCreatePatient.status = "error";
          state.postCreatePatient.message = action.error.message;
          state.postCreatePatient.error = undefined;
        },
      },
    ),
    resetPostCreatePatient: create.reducer((state) => {
      state.postCreatePatient = initialState.postCreatePatient;
    }),
  }),
  selectors: {
    selectGetPatients: (state) => state.getPatients,
    selectPostCreatePatient: (state) => state.postCreatePatient,
  },
});

export const { getPatients, postCreatePatient, resetPostCreatePatient } =
  patientsSlice.actions;
export const { selectGetPatients, selectPostCreatePatient } =
  patientsSlice.selectors;
export default patientsSlice.reducer;
