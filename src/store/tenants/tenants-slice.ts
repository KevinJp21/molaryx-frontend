import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import {
  apiGetTenantsAction,
  IGetTenantsResponseData,
  TGetTenantsParams,
} from "@/features/platform/modules/tenants";

type TTenantsState = {
  getTenants: {
    status: TStatus;
    data?: IGetTenantsResponseData;
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
  }),
  selectors: {
    selectGetTenants: (state) => state.getTenants,
  },
});

export const { getTenants } = tenantsSlice.actions;
export const { selectGetTenants } = tenantsSlice.selectors;
export default tenantsSlice.reducer;
