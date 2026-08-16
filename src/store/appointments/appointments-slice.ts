import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import {
  IGetAppointmentsResponseData,
  apiGetAppointmentsAction,
  TGetAppointmentsParams,
  IPostAppointmentFormRequest,
  apiPostCreateAppointmentAction,
} from "@/features/dashboard/modules/appointments";

type TAppointmentsState = {
  getAppointments: {
    status: TStatus;
    data?: IGetAppointmentsResponseData[];
    message?: string;
    error?: string;
  };
  postCreateAppointment: {
    status: TStatus;
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
  postCreateAppointment: {
    status: "idle",
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
    postCreateAppointment: create.asyncThunk(
      async (data: IPostAppointmentFormRequest) =>
        await apiPostCreateAppointmentAction(data),
      {
        pending: (state) => {
          state.postCreateAppointment.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreateAppointment.status = "error";
            state.postCreateAppointment.message = action.payload.message;
            state.postCreateAppointment.error = action.payload.error ?? undefined;
            return;
          }
          state.postCreateAppointment.status = "success";
          state.postCreateAppointment.message = action.payload.message;
        },
        rejected: (state, action) => {
          state.postCreateAppointment.status = "error";
          state.postCreateAppointment.message = action.error.message;
          state.postCreateAppointment.error = undefined;
        },
      },
    ),
    resetPostCreateAppointment: create.reducer((state) => {
      state.postCreateAppointment = initialState.postCreateAppointment;
    }),
  }),
  selectors: {
    selectGetAppointments: (state) => state.getAppointments,
    selectPostCreateAppointment: (state) => state.postCreateAppointment,
  },
});

export const { getAppointments, postCreateAppointment, resetPostCreateAppointment } = appointmentsSlice.actions;
export const { selectGetAppointments, selectPostCreateAppointment } = appointmentsSlice.selectors;
export default appointmentsSlice.reducer;
