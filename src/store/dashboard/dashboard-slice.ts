import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import {
  apiGetPaymentsSummaryAction,
  IGetPaymentsSummaryResponseData,
  apiGetAppointmentsSummaryAction,
  IGetAppointmentsSummaryResponseData,
} from "@/features/dashboard";

type TDashboardState = {
  getPaymentsSummary: {
    status: TStatus;
    message?: string; 
    data?: IGetPaymentsSummaryResponseData;
  };
  getAppointmentsSummary: {
    status: TStatus;
    message?: string;
    data?: IGetAppointmentsSummaryResponseData;
  };
};

const initialState: TDashboardState = {
  getPaymentsSummary: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
  getAppointmentsSummary: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
};

const dashboardSlice = createAppSlice({
  name: "dashboard",
  initialState,
  reducers: (create) => ({
    getPaymentsSummary: create.asyncThunk(
      async () => await apiGetPaymentsSummaryAction(),
      {
        pending: (state) => {
          state.getPaymentsSummary.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getPaymentsSummary.status = "error";
            state.getPaymentsSummary.message = action.payload.message;
            state.getPaymentsSummary.data = undefined;
            return;
          }
          state.getPaymentsSummary.status = "success";
          state.getPaymentsSummary.message = action.payload.message;
          state.getPaymentsSummary.data = action.payload.data ?? undefined;
        },
        rejected: (state, action) => {
          state.getPaymentsSummary.status = "error";
          state.getPaymentsSummary.message = action.error.message;
          state.getPaymentsSummary.data = undefined;
        },
      },
    ),
    getAppointmentsSummary: create.asyncThunk(
      async () => await apiGetAppointmentsSummaryAction(),
      {
        pending: (state) => {
          state.getAppointmentsSummary.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getAppointmentsSummary.status = "error";
            state.getAppointmentsSummary.message = action.payload.message;
            state.getAppointmentsSummary.data = undefined;
            return;
          }
          state.getAppointmentsSummary.status = "success";
          state.getAppointmentsSummary.message = action.payload.message;
          state.getAppointmentsSummary.data = action.payload.data ?? undefined;
        },
        rejected: (state, action) => {
          state.getAppointmentsSummary.status = "error";
          state.getAppointmentsSummary.message = action.error.message;
          state.getAppointmentsSummary.data = undefined;
        },
      },
    )
  }),
  selectors: {
    selectGetPaymentsSummary: (state) => state.getPaymentsSummary,
    selectGetAppointmentsSummary: (state) => state.getAppointmentsSummary,
  },
});

export const { getPaymentsSummary, getAppointmentsSummary } = dashboardSlice.actions;
export const { selectGetPaymentsSummary, selectGetAppointmentsSummary } = dashboardSlice.selectors;
export default dashboardSlice.reducer;
