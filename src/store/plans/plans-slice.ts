import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import { apiGetPublicPlansAction, IGetPublicPlans } from "@/features";

type TPlansState = {
  getPublicPlans: {
    status: TStatus;
    message: string | undefined;
    data: IGetPublicPlans[] | undefined;
  };
};

const initialState: TPlansState = {
  getPublicPlans: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
};

const plansSlice = createAppSlice({
  name: "plans",
  initialState,
  reducers: (create) => ({
    getPublicPlans: create.asyncThunk(async () => apiGetPublicPlansAction(), {
      pending: (state) => {
        state.getPublicPlans.status = "loading";
      },
      fulfilled: (state, action) => {
        if (!action.payload.success) {
          state.getPublicPlans.status = "error";
          state.getPublicPlans.message = action.payload.message;
          state.getPublicPlans.data = undefined;
          return;
        }
        state.getPublicPlans.status = "success";
        state.getPublicPlans.message = action.payload.message;
        state.getPublicPlans.data = action.payload.data;
      },
      rejected: (state, action) => {
        state.getPublicPlans.status = "error";
        state.getPublicPlans.message = action.error.message;
        state.getPublicPlans.data = undefined;
      },
    }),
  }),
  selectors: {
    selectGetPublicPlans: (state) => state.getPublicPlans,
  },
});

export const { getPublicPlans } = plansSlice.actions;
export const { selectGetPublicPlans } = plansSlice.selectors;
export default plansSlice.reducer;
