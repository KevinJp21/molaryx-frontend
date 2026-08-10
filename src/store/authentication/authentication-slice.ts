import { createAppSlice } from "../slice";
import { TStatus } from "@/types";
import {
  apiPostSignUpAction,
  IPostSignUpFormRequest,
  apiPostSignIn,
  IPostSignInFormRequest,
} from "@/features";

type TAuthenticationState = {
  postSignUp: {
    status: TStatus;
    message: string | undefined;
    error: string | undefined;
  };
  postSignIn: {
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
  postSignIn: {
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
            state.postSignUp.error = action.payload.error ?? undefined;
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
    postSignIn: create.asyncThunk(
      async (data: IPostSignInFormRequest) => apiPostSignIn(data),
      {
        pending: (state) => {
          state.postSignIn.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postSignIn.status = "error";
            state.postSignIn.message = action.payload.message;
            state.postSignIn.error = action.payload.error ?? undefined;
            return;
          }
          state.postSignIn.status = "success";
          state.postSignIn.message = action.payload.message;
          state.postSignIn.error = undefined;
        },
        rejected: (state, action) => {
          state.postSignIn.status = "error";
          state.postSignIn.message = action.error.message;
          state.postSignIn.error = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectPostSignUp: (state) => state.postSignUp,
    selectPostSignIn: (state) => state.postSignIn,
  },
});

export const { postSignUp, resetPostSignUp, postSignIn } = authenticationSlice.actions;
export const { selectPostSignUp, selectPostSignIn } = authenticationSlice.selectors;
export default authenticationSlice.reducer;
