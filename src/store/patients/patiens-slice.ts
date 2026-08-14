import { createAppSlice } from "../slice";
import {
  apiGetPatientsAction,
  IGetPatientsResponseData,
  TGetPatientsParams,
  apiPostCreatePatientAction,
  IPostCreatePatientFormRequest,
  apiPutUpdatePatientAction,
  IPutUpdatePatientFormRequest,
  apiDeletePatientAction,
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
  putUpdatePatient: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  deletePatient: {
    status: TStatus;
    message?: string;
    error?: string;
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
  putUpdatePatient: {
    status: "idle",
    message: undefined,
  },
  deletePatient: {
    status: "idle",
    message: undefined,
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
    putUpdatePatient: create.asyncThunk(
      async (data: IPutUpdatePatientFormRequest) =>
        await apiPutUpdatePatientAction(data),
      {
        pending: (state) => {
          state.putUpdatePatient.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.putUpdatePatient.status = "error";
            state.putUpdatePatient.message = action.payload.message;
            state.putUpdatePatient.error = action.payload.error ?? undefined;
            return;
          }
          state.putUpdatePatient.status = "success";
          state.putUpdatePatient.message = action.payload.message;
          state.putUpdatePatient.error = undefined;
        },
        rejected: (state, action) => {
          state.putUpdatePatient.status = "error";
          state.putUpdatePatient.message = action.error.message;
          state.putUpdatePatient.error = undefined;
        },
      },
    ),
    resetPutUpdatePatient: create.reducer((state) => {
      state.putUpdatePatient = initialState.putUpdatePatient;
    }),
    deletePatient: create.asyncThunk(
      async (idPatient: number) => await apiDeletePatientAction(idPatient),
      {
        pending: (state) => {
          state.deletePatient.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.deletePatient.status = "error";
            state.deletePatient.message = action.payload.message;
            return;
          }
          state.deletePatient.status = "success";
          state.deletePatient.message = action.payload.message;
        },
        rejected: (state, action) => {
          state.deletePatient.status = "error";
          state.deletePatient.message = action.error.message;
        },
      },
    ),
    resetDeletePatient: create.reducer((state) => {
      state.deletePatient = initialState.deletePatient;
    }),
  }),
  selectors: {
    selectGetPatients: (state) => state.getPatients,
    selectPostCreatePatient: (state) => state.postCreatePatient,
    selectPutUpdatePatient: (state) => state.putUpdatePatient,
    selectDeletePatient: (state) => state.deletePatient,
  },
});

export const {
  getPatients,
  postCreatePatient,
  resetPostCreatePatient,
  putUpdatePatient,
  resetPutUpdatePatient,
  deletePatient,
  resetDeletePatient,
} = patientsSlice.actions;
export const {
  selectGetPatients,
  selectPostCreatePatient,
  selectPutUpdatePatient,
  selectDeletePatient,
} = patientsSlice.selectors;
export default patientsSlice.reducer;
