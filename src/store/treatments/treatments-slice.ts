import { createAppSlice } from "../slice";
import {
  apiGetTreatmentsAction,
  TGetTreatmentsParams,
  apiPostCreateTreatmentAction,
  apiPutUpdateTreatmentAction,
  apiDeleteTreatmentAction,
} from "@/features/dashboard/modules/treatments/actions";
import {
  IGetTreatmentsResponseData,
  IPostCreateTreatmentFormRequest,
  IPutUpdateTreatmentFormRequest,
} from "@/features/dashboard/modules/treatments/interfaces";
import { TStatus } from "@/types";

type TTreatmentsState = {
  postCreateTreatment: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  getTreatments: {
    status: TStatus;
    message?: string;
    error?: string;
    data?: IGetTreatmentsResponseData;
  };
  putUpdateTreatment: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  deleteTreatment: {
    status: TStatus;
    message?: string;
    error?: string;
  };
};

const initialState: TTreatmentsState = {
  postCreateTreatment: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  getTreatments: {
    status: "idle",
    message: undefined,
    error: undefined,
    data: undefined,
  },
  putUpdateTreatment: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  deleteTreatment: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
};

const treatmentsSlice = createAppSlice({
  name: "treatments",
  initialState,
  reducers: (create) => ({
    getTreatments: create.asyncThunk(
      async (params?: TGetTreatmentsParams) =>
        await apiGetTreatmentsAction(params),
      {
        pending: (state) => {
          state.getTreatments.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getTreatments.status = "error";
            state.getTreatments.message = action.payload.message;
            state.getTreatments.error = action.payload.error ?? undefined;
            state.getTreatments.data = undefined;
            return;
          }
          state.getTreatments.status = "success";
          state.getTreatments.message = action.payload.message;
          state.getTreatments.error = undefined;
          state.getTreatments.data = action.payload.data ?? undefined;
        },
        rejected: (state, action) => {
          state.getTreatments.status = "error";
          state.getTreatments.message = action.error.message;
          state.getTreatments.error = undefined;
          state.getTreatments.data = undefined;
        },
      },
    ),
    postCreateTreatment: create.asyncThunk(
      async (data: IPostCreateTreatmentFormRequest) =>
        await apiPostCreateTreatmentAction(data),
      {
        pending: (state) => {
          state.postCreateTreatment.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreateTreatment.status = "error";
            state.postCreateTreatment.message = action.payload.message;
            state.postCreateTreatment.error = action.payload.error ?? undefined;
            return;
          }
          state.postCreateTreatment.status = "success";
          state.postCreateTreatment.message = action.payload.message;
          state.postCreateTreatment.error = undefined;
        },
        rejected: (state, action) => {
          state.postCreateTreatment.status = "error";
          state.postCreateTreatment.message = action.error.message;
          state.postCreateTreatment.error = undefined;
        },
      },
    ),
    resetPostCreateTreatment: create.reducer((state) => {
      state.postCreateTreatment = initialState.postCreateTreatment;
    }),
    putUpdateTreatment: create.asyncThunk(
      async (data: IPutUpdateTreatmentFormRequest) =>
        await apiPutUpdateTreatmentAction(data),
      {
        pending: (state) => {
          state.putUpdateTreatment.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.putUpdateTreatment.status = "error";
            state.putUpdateTreatment.message = action.payload.message;
            state.putUpdateTreatment.error = action.payload.error ?? undefined;
            return;
          }
          state.putUpdateTreatment.status = "success";
          state.putUpdateTreatment.message = action.payload.message;
          state.putUpdateTreatment.error = undefined;
        },
        rejected: (state, action) => {
          state.putUpdateTreatment.status = "error";
          state.putUpdateTreatment.message = action.error.message;
          state.putUpdateTreatment.error = undefined;
        },
      },
    ),
    resetPutUpdateTreatment: create.reducer((state) => {
      state.putUpdateTreatment = initialState.putUpdateTreatment;
    }),
    deleteTreatment: create.asyncThunk(
      async (idTreatment: number) =>
        await apiDeleteTreatmentAction(idTreatment),
      {
        pending: (state) => {
          state.deleteTreatment.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.deleteTreatment.status = "error";
            state.deleteTreatment.message = action.payload.message;
            return;
          }
          state.deleteTreatment.status = "success";
          state.deleteTreatment.message = action.payload.message;
        },
        rejected: (state, action) => {
          state.deleteTreatment.status = "error";
          state.deleteTreatment.message = action.error.message;
        },
      },
    ),
    resetDeleteTreatment: create.reducer((state) => {
      state.deleteTreatment = initialState.deleteTreatment;
    }),
  }),
  selectors: {
    selectGetTreatments: (state) => state.getTreatments,
    selectPostCreateTreatment: (state) => state.postCreateTreatment,
    selectPutUpdateTreatment: (state) => state.putUpdateTreatment,
    selectDeleteTreatment: (state) => state.deleteTreatment,
  },
});

export const {
  getTreatments,
  postCreateTreatment,
  resetPostCreateTreatment,
  putUpdateTreatment,
  resetPutUpdateTreatment,
  deleteTreatment,
  resetDeleteTreatment,
} = treatmentsSlice.actions;
export const {
  selectGetTreatments,
  selectPostCreateTreatment,
  selectPutUpdateTreatment,
  selectDeleteTreatment,
} = treatmentsSlice.selectors;
export default treatmentsSlice.reducer;
