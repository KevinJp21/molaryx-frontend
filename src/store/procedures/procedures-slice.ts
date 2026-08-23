import { createAppSlice } from "../slice";
import {
  apiGetProceduresAction,
  TGetProceduresParams,
  apiPostCreateProcedureAction,
  apiPutUpdateProcedureAction,
  apiDeleteProcedureAction,
} from "@/features/dashboard/modules/procedures/actions";
import {
  IGetProceduresResponseData,
  IPostCreateProcedureFormRequest,
  IPutUpdateProcedureFormRequest,
} from "@/features/dashboard/modules/procedures/interfaces";
import { TStatus } from "@/types";

type TProceduresState = {
  postCreateProcedure: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  getProcedures: {
    status: TStatus;
    message?: string;
    error?: string;
    data?: IGetProceduresResponseData;
  };
  putUpdateProcedure: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  deleteProcedure: {
    status: TStatus;
    message?: string;
    error?: string;
  };
};

const initialState: TProceduresState = {
  postCreateProcedure: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  getProcedures: {
    status: "idle",
    message: undefined,
    error: undefined,
    data: undefined,
  },
  putUpdateProcedure: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  deleteProcedure: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
};

const proceduresSlice = createAppSlice({
  name: "procedures",
  initialState,
  reducers: (create) => ({
    getProcedures: create.asyncThunk(
      async (params?: TGetProceduresParams) =>
        await apiGetProceduresAction(params),
      {
        pending: (state) => {
          state.getProcedures.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getProcedures.status = "error";
            state.getProcedures.message = action.payload.message;
            state.getProcedures.error = action.payload.error ?? undefined;
            state.getProcedures.data = undefined;
            return;
          }
          state.getProcedures.status = "success";
          state.getProcedures.message = action.payload.message;
          state.getProcedures.error = undefined;
          state.getProcedures.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.getProcedures.status = "error";
          state.getProcedures.message = action.error.message;
          state.getProcedures.error = undefined;
          state.getProcedures.data = undefined;
        },
      },
    ),
    postCreateProcedure: create.asyncThunk(
      async (data: IPostCreateProcedureFormRequest) =>
        await apiPostCreateProcedureAction(data),
      {
        pending: (state) => {
          state.postCreateProcedure.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreateProcedure.status = "error";
            state.postCreateProcedure.message = action.payload.message;
            state.postCreateProcedure.error = action.payload.error ?? undefined;
            return;
          }
          state.postCreateProcedure.status = "success";
          state.postCreateProcedure.message = action.payload.message;
          state.postCreateProcedure.error = undefined;
        },
        rejected: (state, action) => {
          state.postCreateProcedure.status = "error";
          state.postCreateProcedure.message = action.error.message;
          state.postCreateProcedure.error = undefined;
        },
      },
    ),
    resetPostCreateProcedure: create.reducer((state) => {
      state.postCreateProcedure = initialState.postCreateProcedure;
    }),
    putUpdateProcedure: create.asyncThunk(
      async (data: IPutUpdateProcedureFormRequest) =>
        await apiPutUpdateProcedureAction(data),
      {
        pending: (state) => {
          state.putUpdateProcedure.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.putUpdateProcedure.status = "error";
            state.putUpdateProcedure.message = action.payload.message;
            state.putUpdateProcedure.error = action.payload.error ?? undefined;
            return;
          }
          state.putUpdateProcedure.status = "success";
          state.putUpdateProcedure.message = action.payload.message;
          state.putUpdateProcedure.error = undefined;
        },
        rejected: (state, action) => {
          state.putUpdateProcedure.status = "error";
          state.putUpdateProcedure.message = action.error.message;
          state.putUpdateProcedure.error = undefined;
        },
      },
    ),
    resetPutUpdateProcedure: create.reducer((state) => {
      state.putUpdateProcedure = initialState.putUpdateProcedure;
    }),
    deleteProcedure: create.asyncThunk(
      async (idProcedure: number) =>
        await apiDeleteProcedureAction(idProcedure),
      {
        pending: (state) => {
          state.deleteProcedure.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.deleteProcedure.status = "error";
            state.deleteProcedure.message = action.payload.message;
            return;
          }
          state.deleteProcedure.status = "success";
          state.deleteProcedure.message = action.payload.message;
        },
        rejected: (state, action) => {
          state.deleteProcedure.status = "error";
          state.deleteProcedure.message = action.error.message;
        },
      },
    ),
    resetDeleteProcedure: create.reducer((state) => {
      state.deleteProcedure = initialState.deleteProcedure;
    }),
  }),
  selectors: {
    selectGetProcedures: (state) => state.getProcedures,
    selectPostCreateProcedure: (state) => state.postCreateProcedure,
    selectPutUpdateProcedure: (state) => state.putUpdateProcedure,
    selectDeleteProcedure: (state) => state.deleteProcedure,
  },
});

export const {
  getProcedures,
  postCreateProcedure,
  resetPostCreateProcedure,
  putUpdateProcedure,
  resetPutUpdateProcedure,
  deleteProcedure,
  resetDeleteProcedure,
} = proceduresSlice.actions;
export const {
  selectGetProcedures,
  selectPostCreateProcedure,
  selectPutUpdateProcedure,
  selectDeleteProcedure,
} = proceduresSlice.selectors;
export default proceduresSlice.reducer;
