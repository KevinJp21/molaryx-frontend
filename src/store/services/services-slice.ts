import { createAppSlice } from "../slice";
import {
  apiGetServicesAction,
  TGetServicesParams,
  apiPostCreateServiceAction,
  apiPutUpdateServiceAction,
  apiDeleteServiceAction,
} from "@/features/dashboard/modules/services/actions";
import {
  IGetServicesResponseData,
  IPostCreateServiceFormRequest,
  IPutUpdateServiceFormRequest,
} from "@/features/dashboard/modules/services/interfaces";
import { TStatus } from "@/types";

type TServicesState = {
  postCreateService: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  getServices: {
    status: TStatus;
    message?: string;
    data?: IGetServicesResponseData;
  };
  putUpdateService: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  deleteService: {
    status: TStatus;
    message?: string;
    error?: string;
  };
};

const initialState: TServicesState = {
  postCreateService: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  getServices: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
  putUpdateService: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  deleteService: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
};

const servicesSlice = createAppSlice({
  name: "services",
  initialState,
  reducers: (create) => ({
    getServices: create.asyncThunk(
      async (params?: TGetServicesParams) => await apiGetServicesAction(params),
      {
        pending: (state) => {
          state.getServices.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getServices.status = "error";
            state.getServices.message = action.payload.message;
            state.getServices.data = undefined;
            return;
          }
          state.getServices.status = "success";
          state.getServices.message = action.payload.message;
          state.getServices.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.getServices.status = "error";
          state.getServices.message = action.error.message;
          state.getServices.data = undefined;
        },
      },
    ),
    postCreateService: create.asyncThunk(
      async (data: IPostCreateServiceFormRequest) =>
        await apiPostCreateServiceAction(data),
      {
        pending: (state) => {
          state.postCreateService.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreateService.status = "error";
            state.postCreateService.message = action.payload.message;
            state.postCreateService.error = action.payload.error ?? undefined;
            return;
          }
          state.postCreateService.status = "success";
          state.postCreateService.message = action.payload.message;
          state.postCreateService.error = undefined;
        },
        rejected: (state, action) => {
          state.postCreateService.status = "error";
          state.postCreateService.message = action.error.message;
          state.postCreateService.error = undefined;
        },
      },
    ),
    resetPostCreateService: create.reducer((state) => {
      state.postCreateService = initialState.postCreateService;
    }),
    putUpdateService: create.asyncThunk(
      async (data: IPutUpdateServiceFormRequest) =>
        await apiPutUpdateServiceAction(data),
      {
        pending: (state) => {
          state.putUpdateService.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.putUpdateService.status = "error";
            state.putUpdateService.message = action.payload.message;
            state.putUpdateService.error = action.payload.error ?? undefined;
            return;
          }
          state.putUpdateService.status = "success";
          state.putUpdateService.message = action.payload.message;
          state.putUpdateService.error = undefined;
        },
        rejected: (state, action) => {
          state.putUpdateService.status = "error";
          state.putUpdateService.message = action.error.message;
          state.putUpdateService.error = undefined;
        },
      },
    ),
    resetPutUpdateService: create.reducer((state) => {
      state.putUpdateService = initialState.putUpdateService;
    }),
    deleteService: create.asyncThunk(
      async (idService: number) => await apiDeleteServiceAction(idService),
      {
        pending: (state) => {
          state.deleteService.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.deleteService.status = "error";
            state.deleteService.message = action.payload.message;
            return;
          }
          state.deleteService.status = "success";
          state.deleteService.message = action.payload.message;
        },
        rejected: (state, action) => {
          state.deleteService.status = "error";
          state.deleteService.message = action.error.message;
        },
      },
    ),
    resetDeleteService: create.reducer((state) => {
      state.deleteService = initialState.deleteService;
    }),
  }),
  selectors: {
    selectGetServices: (state) => state.getServices,
    selectPostCreateService: (state) => state.postCreateService,
    selectPutUpdateService: (state) => state.putUpdateService,
    selectDeleteService: (state) => state.deleteService,
  },
});

export const {
  getServices,
  postCreateService,
  resetPostCreateService,
  putUpdateService,
  resetPutUpdateService,
  deleteService,
  resetDeleteService,
} = servicesSlice.actions;
export const {
  selectGetServices,
  selectPostCreateService,
  selectPutUpdateService,
  selectDeleteService,
} = servicesSlice.selectors;
export default servicesSlice.reducer;
