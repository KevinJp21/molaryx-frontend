import { createAppSlice } from "../slice";
import { TStatus, TUserState } from "@/types";
import {
  apiPostSignUpAction,
  IPostSignUpFormRequest,
  apiPostSignInAction,
  IPostSignInFormRequest,
  apiGetUserAction,
  IGetUserResponseData,
} from "@/features/authentication";

type TAuthenticationState = {
  postSignUp: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  postSignIn: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  getUserData: {
    status: TStatus;
    message?: string;
    data?: IGetUserResponseData;
    userState: TUserState;
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
  getUserData: {
    status: "idle",
    message: undefined,
    data: undefined,
    userState: "unauthenticated",
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
      async (data: IPostSignInFormRequest) => apiPostSignInAction(data),
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
          state.postSignIn.error = action.error.message;
        },
      },
    ),
    getUserData: create.asyncThunk(async () => {
      const first = await apiGetUserAction();
      if (first.success) return first;
      // El proxy puede haber rotado el refresh en el documento y este
      // Server Action aún sale con las cookies viejas. Un segundo intento
      // ya lleva el access token nuevo.
      await new Promise((resolve) => setTimeout(resolve, 400));
      return apiGetUserAction();
    }, {
      pending: (state) => {
        state.getUserData.status = "loading";
        state.getUserData.userState = "checking";
      },
      fulfilled: (state, action) => {
        if (!action.payload.success) {
          state.getUserData.status = "error";
          state.getUserData.message = action.payload.message;
          state.getUserData.userState = "unauthenticated";
          return;
        }
        state.getUserData.status = "success";
        state.getUserData.message = action.payload.message;
        state.getUserData.data = action.payload.data;
        state.getUserData.userState = "authenticated";
      },
      rejected: (state, action) => {
        state.getUserData.status = "error";
        state.getUserData.message = action.error.message;
        state.getUserData.userState = "unauthenticated";
      },
    }),
    logout: create.reducer(() => ({
      ...initialState,
      getUserData: {
        ...initialState.getUserData,
        status: "success",
        userState: "unauthenticated",
      },
    })),
  }),
  selectors: {
    selectPostSignUp: (state) => state.postSignUp,
    selectPostSignIn: (state) => state.postSignIn,
    selectGetUserData: (state) => state.getUserData,
  },
});

export const { postSignUp, resetPostSignUp, postSignIn, getUserData, logout } =
  authenticationSlice.actions;
export const { selectPostSignUp, selectPostSignIn, selectGetUserData } =
  authenticationSlice.selectors;
export default authenticationSlice.reducer;
