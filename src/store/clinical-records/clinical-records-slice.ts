import { createAppSlice } from "../slice";
import {
  apiGetClinicalRecordsAction,
  apiPostCreateClinicalRecordAction,
  TGetClinicalRecordsParams,
} from "@/features/dashboard/modules/clinical-records/actions";
import {
  IGetClinicalRecordsResponseData,
  IPostCreateClinicalRecordFormRequest,
} from "@/features/dashboard/modules/clinical-records/interfaces";
import { TStatus } from "@/types";

type TClinicalRecordsState = {
  getClinicalRecords: {
    status: TStatus;
    message?: string;
    error?: string;
    data?: IGetClinicalRecordsResponseData;
  };
  postCreateClinicalRecord: {
    status: TStatus;
    message?: string;
    error?: string;
  };
};

const initialState: TClinicalRecordsState = {
  getClinicalRecords: {
    status: "idle",
    message: undefined,
    error: undefined,
    data: undefined,
  },
  postCreateClinicalRecord: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
};

const clinicalRecordsSlice = createAppSlice({
  name: "clinicalRecords",
  initialState,
  reducers: (create) => ({
    getClinicalRecords: create.asyncThunk(
      async (params?: TGetClinicalRecordsParams) =>
        await apiGetClinicalRecordsAction(params),
      {
        pending: (state) => {
          state.getClinicalRecords.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getClinicalRecords.status = "error";
            state.getClinicalRecords.message = action.payload.message;
            state.getClinicalRecords.error = action.payload.error ?? undefined;
            state.getClinicalRecords.data = undefined;
            return;
          }
          state.getClinicalRecords.status = "success";
          state.getClinicalRecords.message = action.payload.message;
          state.getClinicalRecords.error = undefined;
          state.getClinicalRecords.data = action.payload.data ?? undefined;
        },
        rejected: (state, action) => {
          state.getClinicalRecords.status = "error";
          state.getClinicalRecords.message = action.error.message;
          state.getClinicalRecords.error = undefined;
          state.getClinicalRecords.data = undefined;
        },
      },
    ),
    postCreateClinicalRecord: create.asyncThunk(
      async (data: IPostCreateClinicalRecordFormRequest) =>
        await apiPostCreateClinicalRecordAction(data),
      {
        pending: (state) => {
          state.postCreateClinicalRecord.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreateClinicalRecord.status = "error";
            state.postCreateClinicalRecord.message = action.payload.message;
            state.postCreateClinicalRecord.error =
              action.payload.error ?? undefined;
            return;
          }
          state.postCreateClinicalRecord.status = "success";
          state.postCreateClinicalRecord.message = action.payload.message;
          state.postCreateClinicalRecord.error = undefined;
        },
        rejected: (state, action) => {
          state.postCreateClinicalRecord.status = "error";
          state.postCreateClinicalRecord.message = action.error.message;
          state.postCreateClinicalRecord.error = undefined;
        },
      },
    ),
    resetPostCreateClinicalRecord: create.reducer((state) => {
      state.postCreateClinicalRecord = initialState.postCreateClinicalRecord;
    }),
  }),
  selectors: {
    selectGetClinicalRecords: (state) => state.getClinicalRecords,
    selectPostCreateClinicalRecord: (state) => state.postCreateClinicalRecord,
  },
});

export const {
  getClinicalRecords,
  postCreateClinicalRecord,
  resetPostCreateClinicalRecord,
} = clinicalRecordsSlice.actions;
export const {
  selectGetClinicalRecords,
  selectPostCreateClinicalRecord,
} = clinicalRecordsSlice.selectors;
export default clinicalRecordsSlice.reducer;
