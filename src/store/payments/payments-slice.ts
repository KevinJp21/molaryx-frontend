import { createAppSlice } from "../slice";
import {
  apiGetPaymentsAction,
  TGetPaymentsParams,
} from "@/features/dashboard/modules/patients/modules/payments/actions";
import { IGetPaymentsResponseData } from "@/features/dashboard/modules/patients/modules/payments/interfaces";
import { TStatus } from "@/types";

type TPaymentsState = {
  getPayments: {
    status: TStatus;
    message?: string;
    data?: IGetPaymentsResponseData;
  };
};

const initialState: TPaymentsState = {
  getPayments: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
};

const paymentsSlice = createAppSlice({
  name: "payments",
  initialState,
  reducers: (create) => ({
    getPayments: create.asyncThunk(
      async (params: TGetPaymentsParams) => await apiGetPaymentsAction(params),
      {
        pending: (state) => {
          state.getPayments.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getPayments.status = "error";
            state.getPayments.message = action.payload.message;
            state.getPayments.data = undefined;
            return;
          }
          state.getPayments.status = "success";
          state.getPayments.message = action.payload.message;
          state.getPayments.data = action.payload.data ?? undefined;
        },
        rejected: (state, action) => {
          state.getPayments.status = "error";
          state.getPayments.message = action.error.message;
          state.getPayments.data = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectGetPayments: (state) => state.getPayments,
  },
});

export const { getPayments } = paymentsSlice.actions;
export const { selectGetPayments } = paymentsSlice.selectors;
export default paymentsSlice.reducer;
