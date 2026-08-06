import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import { apiGetIdentificationTypes, TMasterItem } from "@/features";

type TMasterState = {
  identificationTypes: {
    status: TStatus;
    message: string | undefined;
    data: TMasterItem<"idIdentificationType">[] | undefined;
  };
};

const initialState: TMasterState = {
  identificationTypes: {
    status: "idle",
    message: undefined,
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
            state.identificationTypes.message = action.payload.message;
            return;
          }
          state.identificationTypes.status = "success";
          state.identificationTypes.message = undefined;
          state.identificationTypes.data = action.payload.data?.data ?? undefined;
        },
        rejected: (state, action) => {
          state.identificationTypes.status = "error";
          state.identificationTypes.message = action.error.message;
          state.identificationTypes.data = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectGetIdentificationTypes: (state) => state.identificationTypes,
  },
});

export const { getIdentificationTypes } = mastersSlice.actions;
export const { selectGetIdentificationTypes } = mastersSlice.selectors;
export default mastersSlice.reducer;
