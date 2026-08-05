import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import { apiGetIdentificationTypes, TMasterItem, TMasterListResponse } from "@/features";

type TMasterState = {
  identificationTypes: {
    status: TStatus;
    error: string | undefined;
    data: TMasterItem<"idIdentificationType">[] | undefined;
  };
};

const initialState: TMasterState = {
  identificationTypes: {
    status: "idle",
    error: undefined,
    data: undefined,
  },
};

const mastersSlice = createAppSlice({
  name: "masters",
  initialState,
  reducers: (create) => ({
    getIdentificationTypes: create.asyncThunk(
      async () => apiGetIdentificationTypes(),
      {
        pending: (state) => {
          state.identificationTypes.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.identificationTypes.status = "error";
            state.identificationTypes.error = action.payload.error;
            return;
          }
          state.identificationTypes.status = "success";
          state.identificationTypes.error = undefined;
          state.identificationTypes.data = action.payload.data?.data;
        },
        rejected: (state, action) => {
          state.identificationTypes.status = "error";
          state.identificationTypes.error = action.error.message;
          state.identificationTypes.data = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectIdentificationTypes: (state) => state.identificationTypes,
  },
});

export const { getIdentificationTypes } = mastersSlice.actions;
export const { selectIdentificationTypes } = mastersSlice.selectors;
export default mastersSlice.reducer;
