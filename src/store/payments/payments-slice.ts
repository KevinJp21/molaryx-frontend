import { createAppSlice } from "../slice";
import {
  apiGetPaymentsAction,
  apiPostCreatePaymentAction,
  TGetPaymentsParams,
} from "@/features/dashboard/modules/patients/modules/payments/actions";
import {
  IGetPaymentsResponseData,
  IPostCreatePaymentFormRequest,
} from "@/features/dashboard/modules/patients/modules/payments/interfaces";
import { TStatus } from "@/types";

type TPaymentsState = {
  getPayments: {
    status: TStatus;
    message?: string;
    data?: IGetPaymentsResponseData;
  };
  postCreatePayment: {
    status: TStatus;
    message?: string;
    error?: string;
  };
};

const initialState: TPaymentsState = {
  getPayments: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
  postCreatePayment: {
    status: "idle",
    message: undefined,
    error: undefined,
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
    postCreatePayment: create.asyncThunk(
      async (data: IPostCreatePaymentFormRequest) =>
        await apiPostCreatePaymentAction(data),
      {
        pending: (state) => {
          state.postCreatePayment.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreatePayment.status = "error";
            state.postCreatePayment.message = action.payload.message;
            state.postCreatePayment.error = action.payload.error ?? undefined;
            return;
          }
          state.postCreatePayment.status = "success";
          state.postCreatePayment.message = action.payload.message;
          state.postCreatePayment.error = undefined;
        },
        rejected: (state, action) => {
          state.postCreatePayment.status = "error";
          state.postCreatePayment.message = action.error.message;
          state.postCreatePayment.error = undefined;
        },
      },
    ),
    resetPostCreatePayment: create.reducer((state) => {
      state.postCreatePayment = initialState.postCreatePayment;
    }),
  }),
  selectors: {
    selectGetPayments: (state) => state.getPayments,
    selectPostCreatePayment: (state) => state.postCreatePayment,
  },
});

export const { getPayments, postCreatePayment, resetPostCreatePayment } =
  paymentsSlice.actions;
export const { selectGetPayments, selectPostCreatePayment } =
  paymentsSlice.selectors;
export default paymentsSlice.reducer;
