import { createAppSlice } from "../slice";
import { TPaginationResponse, TStatus } from "@/types";
import {
  IGetTeamResponseData,
  TGetTeamParams,
  apiGetTeamAction,
} from "@/features/dashboard/modules/team";

type TTeamState = {
  getTeam: {
    status: TStatus;
    data?: TPaginationResponse<IGetTeamResponseData>;
    message?: string;
    error?: string;
  };
};

const initialState: TTeamState = {
  getTeam: {
    status: "idle",
    data: undefined,
    message: undefined,
    error: undefined,
  },
};

const teamSlice = createAppSlice({
  name: "team",
  initialState,
  reducers: (create) => ({
    getTeam: create.asyncThunk(
      async (params: TGetTeamParams) => await apiGetTeamAction(params),
      {
        pending: (state) => {
          state.getTeam.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getTeam.status = "error";
            state.getTeam.message = action.payload.message;
            state.getTeam.error = action.payload.error ?? undefined;
            state.getTeam.data = undefined;
            return;
          }
          state.getTeam.status = "success";
          state.getTeam.message = action.payload.message;
          state.getTeam.error = undefined;
          state.getTeam.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.getTeam.status = "error";
          state.getTeam.message = action.error.message;
          state.getTeam.error = undefined;
          state.getTeam.data = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectGetTeam: (state) => state.getTeam,
  },
});

export const { getTeam } = teamSlice.actions;
export const { selectGetTeam } = teamSlice.selectors;
export default teamSlice.reducer;
