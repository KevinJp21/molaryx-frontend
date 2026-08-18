import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import {
  IGetAppointmentsResponseData,
  IGetAppointmentsListResponseData,
  apiGetAppointmentsAction,
  apiGetAppointmentsListAction,
  TGetAppointmentsParams,
  TGetAppointmentsListParams,
  IPostAppointmentFormRequest,
  apiPostCreateAppointmentAction,
  IPutUpdateAppointmentFormRequest,
  apiPutUpdateAppointmentAction,
} from "@/features/dashboard/modules/appointments";

type TAppointmentsState = {
  getAppointments: {
    status: TStatus;
    data?: IGetAppointmentsResponseData[];
    message?: string;
    error?: string;
  };
  getAppointmentsList: {
    status: TStatus;
    data?: IGetAppointmentsListResponseData;
    message?: string;
    error?: string;
  };
  postCreateAppointment: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  putUpdateAppointment: {
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
  getAppointmentsList: {
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
  putUpdateAppointment: {
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
    getAppointmentsList: create.asyncThunk(
      async (params?: TGetAppointmentsListParams) =>
        await apiGetAppointmentsListAction(params),
      {
        pending: (state) => {
          state.getAppointmentsList.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getAppointmentsList.status = "error";
            state.getAppointmentsList.message = action.payload.message;
            state.getAppointmentsList.error = action.payload.error ?? undefined;
            state.getAppointmentsList.data = undefined;
            return;
          }
          state.getAppointmentsList.status = "success";
          state.getAppointmentsList.message = action.payload.message;
          state.getAppointmentsList.data = action.payload.data ?? undefined;
        },
        rejected: (state, action) => {
          state.getAppointmentsList.status = "error";
          state.getAppointmentsList.message = action.error.message;
          state.getAppointmentsList.error = undefined;
          state.getAppointmentsList.data = undefined;
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
    putUpdateAppointment: create.asyncThunk(
      async (data: IPutUpdateAppointmentFormRequest) =>
        await apiPutUpdateAppointmentAction(data),
      {
        pending: (state) => {
          state.putUpdateAppointment.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.putUpdateAppointment.status = "error";
            state.putUpdateAppointment.message = action.payload.message;
            state.putUpdateAppointment.error = action.payload.error ?? undefined;
            return;
          }
          state.putUpdateAppointment.status = "success";
          state.putUpdateAppointment.message = action.payload.message;
        },
        rejected: (state, action) => {
          state.putUpdateAppointment.status = "error";
          state.putUpdateAppointment.message = action.error.message;
          state.putUpdateAppointment.error = undefined;
        },
      },
    ),
    resetPutUpdateAppointment: create.reducer((state) => {
      state.putUpdateAppointment = initialState.putUpdateAppointment;
    }),
  }),
  selectors: {
    selectGetAppointments: (state) => state.getAppointments,
    selectGetAppointmentsList: (state) => state.getAppointmentsList,
    selectPostCreateAppointment: (state) => state.postCreateAppointment,
    selectPutUpdateAppointment: (state) => state.putUpdateAppointment,
  },
});

export const {
  getAppointments,
  getAppointmentsList,
  postCreateAppointment,
  resetPostCreateAppointment,
  putUpdateAppointment,
  resetPutUpdateAppointment,
} = appointmentsSlice.actions;
export const {
  selectGetAppointments,
  selectGetAppointmentsList,
  selectPostCreateAppointment,
  selectPutUpdateAppointment,
} = appointmentsSlice.selectors;
export default appointmentsSlice.reducer;
