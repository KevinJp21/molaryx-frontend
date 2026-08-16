import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import {
  IGetAppointmentsResponseData,
  apiGetAppointmentsAction,
  TGetAppointmentsParams,
} from "@/features/dashboard/modules/appointments";

type TAppointmentsState = {
  getAppointments: {
    status: TStatus;
    data?: IGetAppointmentsResponseData[];
    message?: string;
    error?: string;
  };
};

const initialState: TAppointmentsState = {
  getAppointments: {
    status: "idle",
    data: undefined,
    message: undefined,
    error: undefined,
  },
};

const appointmentsSlice = createAppSlice({
  name: "appointments",
  initialState,
  reducers: (create) => ({
    getAppointments: create.asyncThunk(
      async (params: TGetAppointmentsParams) =>
        await apiGetAppointmentsAction(params),
      {
        pending: (state) => {
          state.getAppointments.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getAppointments.status = "error";
            state.getAppointments.message = action.payload.message;
            state.getAppointments.error = action.payload.error ?? undefined;
            state.getAppointments.data = undefined;
            return;
          }
          state.getAppointments.status = "success";
          state.getAppointments.message = action.payload.message;
          state.getAppointments.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.getAppointments.status = "error";
          state.getAppointments.message = action.error.message;
          state.getAppointments.error = undefined;
          state.getAppointments.data = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectGetAppointments: (state) => state.getAppointments,
  },
});

export const { getAppointments } = appointmentsSlice.actions;
export const { selectGetAppointments } = appointmentsSlice.selectors;
export default appointmentsSlice.reducer;
