import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import {
  apiGetTenantsAction,
  apiPostActivateTenantAction,
  apiPostCreateBusinessTenantAction,
  IGetTenantsResponseData,
  IPostActivateTenantRequest,
  IPostCreateBusinessTenantRequest,
  TGetTenantsParams,
} from "@/features/platform/modules/tenants";

type TTenantsState = {
  getTenants: {
    status: TStatus;
    data?: IGetTenantsResponseData;
    message?: string;
    error?: string;
  };
  postActivateTenant: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  postCreateBusinessTenant: {
    status: TStatus;
    message?: string;
    error?: string;
  };
};

const initialState: TTenantsState = {
  getTenants: {
    status: "idle",
    data: undefined,
    message: undefined,
    error: undefined,
  },
  postActivateTenant: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  postCreateBusinessTenant: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
};

const tenantsSlice = createAppSlice({
  name: "tenants",
  initialState,
  reducers: (create) => ({
    getTenants: create.asyncThunk(
      async (params?: TGetTenantsParams) => await apiGetTenantsAction(params),
      {
        pending: (state) => {
          state.getTenants.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getTenants.status = "error";
            state.getTenants.message = action.payload.message;
            state.getTenants.error = action.payload.error ?? undefined;
            state.getTenants.data = undefined;
            return;
          }
          state.getTenants.status = "success";
          state.getTenants.message = action.payload.message;
          state.getTenants.error = undefined;
          state.getTenants.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.getTenants.status = "error";
          state.getTenants.message = action.error.message;
          state.getTenants.error = undefined;
          state.getTenants.data = undefined;
        },
      },
    ),
    postActivateTenant: create.asyncThunk(
      async (data: IPostActivateTenantRequest) =>
        await apiPostActivateTenantAction(data),
      {
        pending: (state) => {
          state.postActivateTenant.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postActivateTenant.status = "error";
            state.postActivateTenant.message = action.payload.message;
            state.postActivateTenant.error = action.payload.error ?? undefined;
            return;
          }
          state.postActivateTenant.status = "success";
          state.postActivateTenant.message = action.payload.message;
          state.postActivateTenant.error = undefined;
        },
        rejected: (state, action) => {
          state.postActivateTenant.status = "error";
          state.postActivateTenant.message = action.error.message;
          state.postActivateTenant.error = undefined;
        },
      },
    ),
    resetPostActivateTenant: create.reducer((state) => {
      state.postActivateTenant = initialState.postActivateTenant;
    }),
    postCreateBusinessTenant: create.asyncThunk(
      async (data: IPostCreateBusinessTenantRequest) =>
        await apiPostCreateBusinessTenantAction(data),
      {
        pending: (state) => {
          state.postCreateBusinessTenant.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreateBusinessTenant.status = "error";
            state.postCreateBusinessTenant.message = action.payload.message;
            state.postCreateBusinessTenant.error =
              action.payload.error ?? undefined;
            return;
          }
          state.postCreateBusinessTenant.status = "success";
          state.postCreateBusinessTenant.message = action.payload.message;
          state.postCreateBusinessTenant.error = undefined;
        },
        rejected: (state, action) => {
          state.postCreateBusinessTenant.status = "error";
          state.postCreateBusinessTenant.message = action.error.message;
          state.postCreateBusinessTenant.error = undefined;
        },
      },
    ),
    resetPostCreateBusinessTenant: create.reducer((state) => {
      state.postCreateBusinessTenant = initialState.postCreateBusinessTenant;
    }),
  }),
  selectors: {
    selectGetTenants: (state) => state.getTenants,
    selectPostActivateTenant: (state) => state.postActivateTenant,
    selectPostCreateBusinessTenant: (state) => state.postCreateBusinessTenant,
  },
});

export const {
  getTenants,
  postActivateTenant,
  resetPostActivateTenant,
  postCreateBusinessTenant,
  resetPostCreateBusinessTenant,
} = tenantsSlice.actions;
export const {
  selectGetTenants,
  selectPostActivateTenant,
  selectPostCreateBusinessTenant,
} = tenantsSlice.selectors;
export default tenantsSlice.reducer;
