import { createAppSlice } from "../slice";
import {
  apiGetPatientsAction,
  IGetPatientsResponseData,
  TGetPatientsParams,
} from "@/features";
import { TStatus } from "@/types";

type TPatientsState = {
  getPatients: {
    status: TStatus;
    message?: string;
    data?: IGetPatientsResponseData;
  };
};

const initialState: TPatientsState = {
  getPatients: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
};

const patientsSlice = createAppSlice({
  name: "patients",
  initialState,
  reducers: (create) => ({
    getPatients: create.asyncThunk(
      async (params?: TGetPatientsParams) => await apiGetPatientsAction(params),
      {
        pending: (state) => {
          state.getPatients.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getPatients.status = "error";
            state.getPatients.message = action.payload.message;
            state.getPatients.data = undefined;
            return;
          }
          state.getPatients.status = "success";
          state.getPatients.message = action.payload.message;
          state.getPatients.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.getPatients.status = "error";
          state.getPatients.message = action.error.message;
          state.getPatients.data = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectGetPatients: (state) => state.getPatients,
  },
});

export const { getPatients } = patientsSlice.actions;
export const { selectGetPatients } = patientsSlice.selectors;
export default patientsSlice.reducer;
