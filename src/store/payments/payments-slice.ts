import { createAppSlice } from "../slice";
import {
  apiGetPaymentsAction,
  apiGetPaymentsSummaryByConceptAction,
  apiPostCreatePaymentAction,
  TGetPaymentsParams,
  TGetPaymentsSummaryByConceptParams,
} from "@/features/dashboard/modules/payments/actions";
import {
  IGetPaymentsResponseData,
  IGetPaymentsSummaryByConceptData,
  IPostCreatePaymentFormRequest,
} from "@/features/dashboard/modules/payments/interfaces";
import { TStatus } from "@/types";

type TPaymentsState = {
  getPayments: {
    status: TStatus;
    message?: string;
    data?: IGetPaymentsResponseData;
  };
  getPaymentsSummaryByConcept: {
    status: TStatus;
    message?: string;
    data?: IGetPaymentsSummaryByConceptData;
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
  getPaymentsSummaryByConcept: {
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
      async (params?: TGetPaymentsParams) => await apiGetPaymentsAction(params),
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
    getPaymentsSummaryByConcept: create.asyncThunk(
      async (params: TGetPaymentsSummaryByConceptParams) =>
        await apiGetPaymentsSummaryByConceptAction(params),
      {
        pending: (state) => {
          state.getPaymentsSummaryByConcept.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getPaymentsSummaryByConcept.status = "error";
            state.getPaymentsSummaryByConcept.message = action.payload.message;
            state.getPaymentsSummaryByConcept.data = undefined;
            return;
          }
          state.getPaymentsSummaryByConcept.status = "success";
          state.getPaymentsSummaryByConcept.message = action.payload.message;
          state.getPaymentsSummaryByConcept.data =
            action.payload.data ?? undefined;
        },
        rejected: (state, action) => {
          state.getPaymentsSummaryByConcept.status = "error";
          state.getPaymentsSummaryByConcept.message = action.error.message;
          state.getPaymentsSummaryByConcept.data = undefined;
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
    resetGetPaymentsSummaryByConcept: create.reducer((state) => {
      state.getPaymentsSummaryByConcept =
        initialState.getPaymentsSummaryByConcept;
    }),
    resetPostCreatePayment: create.reducer((state) => {
      state.postCreatePayment = initialState.postCreatePayment;
    }),
  }),
  selectors: {
    selectGetPayments: (state) => state.getPayments,
    selectGetPaymentsSummaryByConcept: (state) =>
      state.getPaymentsSummaryByConcept,
    selectPostCreatePayment: (state) => state.postCreatePayment,
  },
});

export const {
  getPayments,
  getPaymentsSummaryByConcept,
  postCreatePayment,
  resetGetPaymentsSummaryByConcept,
  resetPostCreatePayment,
} = paymentsSlice.actions;
export const {
  selectGetPayments,
  selectGetPaymentsSummaryByConcept,
  selectPostCreatePayment,
} = paymentsSlice.selectors;
export default paymentsSlice.reducer;
