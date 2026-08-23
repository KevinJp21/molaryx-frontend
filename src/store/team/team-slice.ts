import { createAppSlice } from "../slice";
import { TPaginationResponse, TStatus } from "@/types";
import {
  IGetTeamResponseData,
  TGetTeamParams,
  apiGetTeamAction,
  IPostCreateMemberFormRequest,
  apiPostCreateMemberAction,
  IPutUpdateMemberFormRequest,
  apiPutUpdateMemberAction,
} from "@/features/dashboard/modules/team";

type TTeamState = {
  getTeam: {
    status: TStatus;
    data?: TPaginationResponse<IGetTeamResponseData>;
    message?: string;
    error?: string;
  };
  postCreateMember: {
    status: TStatus;
    data?: boolean;
    message?: string;
    error?: string;
  };
  putUpdateMember: {
    status: TStatus;
    data?: boolean;
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
  postCreateMember: {
    status: "idle",
    data: undefined,
    message: undefined,
    error: undefined,
  },
  putUpdateMember: {
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
    postCreateMember: create.asyncThunk(
      async (data: IPostCreateMemberFormRequest) =>
        await apiPostCreateMemberAction(data),
      {
        pending: (state) => {
          state.postCreateMember.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postCreateMember.status = "error";
            state.postCreateMember.message = action.payload.message;
            state.postCreateMember.error = action.payload.error ?? undefined;
            state.postCreateMember.data = undefined;
            return;
          }
          state.postCreateMember.status = "success";
          state.postCreateMember.message = action.payload.message;
          state.postCreateMember.error = undefined;
          state.postCreateMember.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.postCreateMember.status = "error";
          state.postCreateMember.message = action.error.message;
          state.postCreateMember.error = undefined;
          state.postCreateMember.data = undefined;
        },
      },
    ),
    putUpdateMember: create.asyncThunk(
      async (data: IPutUpdateMemberFormRequest) =>
        await apiPutUpdateMemberAction(data),
      {
        pending: (state) => {
          state.putUpdateMember.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.putUpdateMember.status = "error";
            state.putUpdateMember.message = action.payload.message;
            state.putUpdateMember.error = action.payload.error ?? undefined;
            state.putUpdateMember.data = undefined;
            return;
          }
          state.putUpdateMember.status = "success";
          state.putUpdateMember.message = action.payload.message;
          state.putUpdateMember.error = undefined;
          state.putUpdateMember.data = action.payload.data;
        },
        rejected: (state, action) => {
          state.putUpdateMember.status = "error";
          state.putUpdateMember.message = action.error.message;
          state.putUpdateMember.error = undefined;
          state.putUpdateMember.data = undefined;
        },
      },
    ),
    resetPostCreateMember: create.reducer((state) => {
      state.postCreateMember = initialState.postCreateMember;
    }),
    resetPutUpdateMember: create.reducer((state) => {
      state.putUpdateMember = initialState.putUpdateMember;
    }),
  }),
  selectors: {
    selectGetTeam: (state) => state.getTeam,
    selectPostCreateMember: (state) => state.postCreateMember,
    selectPutUpdateMember: (state) => state.putUpdateMember,
  },
});

export const {
  getTeam,
  postCreateMember,
  putUpdateMember,
  resetPostCreateMember,
  resetPutUpdateMember,
} = teamSlice.actions;
export const {
  selectGetTeam,
  selectPostCreateMember,
  selectPutUpdateMember,
} = teamSlice.selectors;
export default teamSlice.reducer;
