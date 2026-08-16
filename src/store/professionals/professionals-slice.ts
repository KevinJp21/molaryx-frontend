import { createAppSlice } from "../slice";
import { TPaginationResponse, TStatus } from "@/types";
import {
  IGetProfessionalsResponseData,
  TGetProfessionalsParams,
  apiGetProfessionalsAction,
} from "@/features/dashboard/modules/Team";

type TProfessionalsState = {
  getProfessionals: {
    status: TStatus;
    data?: TPaginationResponse<IGetProfessionalsResponseData>;
    message?: string;
  };
};

const initialState: TProfessionalsState = {
  getProfessionals: {
    status: "idle",
    data: undefined,
    message: undefined,
  },
};

const professionalsSlice = createAppSlice({
  name: "professionals",
  initialState,
  reducers: (create) => ({
    getProfessionals: create.asyncThunk(
      async (params: TGetProfessionalsParams) =>
        await apiGetProfessionalsAction(params),
      {
        pending: (state) => {
          state.getProfessionals.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getProfessionals.status = "error";
            state.getProfessionals.message = action.payload.message;
            state.getProfessionals.data = undefined;
            return;
          }
          state.getProfessionals.status = "success";
          state.getProfessionals.message = action.payload.message;
          state.getProfessionals.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.getProfessionals.status = "error";
          state.getProfessionals.message = action.error.message;
          state.getProfessionals.data = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectGetProfessionals: (state) => state.getProfessionals,
  },
});

export const { getProfessionals } = professionalsSlice.actions;
export const { selectGetProfessionals } = professionalsSlice.selectors;
export default professionalsSlice.reducer;
