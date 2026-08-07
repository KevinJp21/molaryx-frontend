import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import { apiPostSignUpAction, IPostSignUpFormRequest } from "@/features";

type TAuthenticationState = {
  postSignUp: {
    status: TStatus;
    message: string | undefined;
    error: string | undefined;
  };
};

const initialState: TAuthenticationState = {
  postSignUp: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
};

const authenticationSlice = createAppSlice({
  name: "authentication",
  initialState,
  reducers: (create) => ({
    postSignUp: create.asyncThunk(
      async (data: IPostSignUpFormRequest) => apiPostSignUpAction(data),
      {
        pending: (state) => {
          state.postSignUp.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postSignUp.status = "error";
            state.postSignUp.message = action.payload.message;
            state.postSignUp.error = action.payload.error;
            return;
          }
          state.postSignUp.status = "success";
          state.postSignUp.message = action.payload.message;
          state.postSignUp.error = undefined;
        },
        rejected: (state, action) => {
          state.postSignUp.status = "error";
          state.postSignUp.message = action.error.message;
          state.postSignUp.error = undefined;
        },
      },
    ),
    resetPostSignUp: create.reducer((state) => {
      state.postSignUp = initialState.postSignUp;
    }),
  }),
  selectors: {
    selectPostSignUp: (state) => state.postSignUp,
  },
});

export const { postSignUp, resetPostSignUp } = authenticationSlice.actions;
export const { selectPostSignUp } = authenticationSlice.selectors;
export default authenticationSlice.reducer;
