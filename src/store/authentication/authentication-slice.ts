import { createAppSlice } from "../slice";
import { TStatus, TUserState } from "@/types";
import {
  apiPostSignUpAction,
  IPostSignUpFormRequest,
  apiPostSignInAction,
  IPostSignInFormRequest,
  apiGetUserAction,
  apiLogoutAction,
  IGetUserResponseData,
  apiPostForgotPasswordAction,
  IPostForgotPasswordFormRequest,
  apiPostResetPasswordAction,
  IPostResetPasswordFormRequest,
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
  postLogout: {
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
  postForgotPassword: {
    status: TStatus;
    message?: string;
    error?: string;
  };
  postResetPassword: {
    status: TStatus;
    message?: string;
    error?: string;
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
  postLogout: {
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
  postForgotPassword: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
  postResetPassword: {
    status: "idle",
    message: undefined,
    error: undefined,
  },
};

const clearAuthenticatedSession = (state: TAuthenticationState) => {
  state.postSignUp = initialState.postSignUp;
  state.postSignIn = initialState.postSignIn;
  state.getUserData = {
    ...initialState.getUserData,
    status: "success",
    userState: "unauthenticated",
  };
  state.postForgotPassword = initialState.postForgotPassword;
  state.postResetPassword = initialState.postResetPassword;
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
    getUserData: create.asyncThunk(
      async () => {
        const first = await apiGetUserAction();
        if (first.success) return first;
        // El proxy puede haber rotado el refresh en el documento y este
        // Server Action aún sale con las cookies viejas. Un segundo intento
        // ya lleva el access token nuevo.
        await new Promise((resolve) => setTimeout(resolve, 400));
        return apiGetUserAction();
      },
      {
        pending: (state) => {
          state.getUserData.status = "loading";
          state.getUserData.userState = "checking";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.getUserData.status = "error";
            state.getUserData.message = action.payload.message;
            // 401 → sin sesión. Error de red/servidor → no forzar sign-in (cookies pueden seguir válidas).
            state.getUserData.userState = action.payload.unauthorized
              ? "unauthenticated"
              : "error";
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
          state.getUserData.userState = "error";
        },
      },
    ),
    postLogout: create.asyncThunk(async () => apiLogoutAction(), {
      pending: (state) => {
        state.postLogout.status = "loading";
        state.postLogout.message = undefined;
        state.postLogout.error = undefined;
      },
      fulfilled: (state, action) => {
        // Las cookies se limpian en el finally del action aunque falle la API.
        clearAuthenticatedSession(state);

        if (!action.payload.success) {
          state.postLogout.status = "error";
          state.postLogout.message = action.payload.message;
          state.postLogout.error = action.payload.error ?? undefined;
          return;
        }

        state.postLogout.status = "success";
        state.postLogout.message = action.payload.message;
        state.postLogout.error = undefined;
      },
      rejected: (state, action) => {
        clearAuthenticatedSession(state);
        state.postLogout.status = "error";
        state.postLogout.message = action.error.message;
        state.postLogout.error = undefined;
      },
    }),
    resetPostLogout: create.reducer((state) => {
      state.postLogout = initialState.postLogout;
    }),
    /** Limpia solo el estado local (p. ej. sesión expirada). Para cerrar con API usa `postLogout`. */
    logout: create.reducer(() => ({
      ...initialState,
      getUserData: {
        ...initialState.getUserData,
        status: "success",
        userState: "unauthenticated",
      },
    })),
    postForgotPassword: create.asyncThunk(
      async (data: IPostForgotPasswordFormRequest) =>
        apiPostForgotPasswordAction(data),
      {
        pending: (state) => {
          state.postForgotPassword.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postForgotPassword.status = "error";
            state.postForgotPassword.message = action.payload.message;
            state.postForgotPassword.error = action.payload.error ?? undefined;
            return;
          }
          state.postForgotPassword.status = "success";
          state.postForgotPassword.message = action.payload.message;
          state.postForgotPassword.error = undefined;
        },
        rejected: (state, action) => {
          state.postForgotPassword.status = "error";
          state.postForgotPassword.message = action.error.message;
          state.postForgotPassword.error = undefined;
        },
      },
    ),
    resetPostForgotPassword: create.reducer((state) => {
      state.postForgotPassword = initialState.postForgotPassword;
    }),
    postResetPassword: create.asyncThunk(
      async (data: IPostResetPasswordFormRequest) =>
        apiPostResetPasswordAction(data),
      {
        pending: (state) => {
          state.postResetPassword.status = "loading";
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.postResetPassword.status = "error";
            state.postResetPassword.message = action.payload.message;
            state.postResetPassword.error = action.payload.error ?? undefined;
            return;
          }
          state.postResetPassword.status = "success";
          state.postResetPassword.message = action.payload.message;
          state.postResetPassword.error = undefined;
        },
        rejected: (state, action) => {
          state.postResetPassword.status = "error";
          state.postResetPassword.message = action.error.message;
          state.postResetPassword.error = undefined;
        },
      },
    ),
    resetPostResetPassword: create.reducer((state) => {
      state.postResetPassword = initialState.postResetPassword;
    }),
  }),
  selectors: {
    selectPostSignUp: (state) => state.postSignUp,
    selectPostSignIn: (state) => state.postSignIn,
    selectPostLogout: (state) => state.postLogout,
    selectGetUserData: (state) => state.getUserData,
    selectPostForgotPassword: (state) => state.postForgotPassword,
    selectPostResetPassword: (state) => state.postResetPassword,
  },
});

export const {
  postSignUp,
  resetPostSignUp,
  postSignIn,
  postLogout,
  resetPostLogout,
  getUserData,
  logout,
  postForgotPassword,
  resetPostForgotPassword,
  postResetPassword,
  resetPostResetPassword,
} = authenticationSlice.actions;
export const {
  selectPostSignUp,
  selectPostSignIn,
  selectPostLogout,
  selectGetUserData,
  selectPostForgotPassword,
  selectPostResetPassword,
} = authenticationSlice.selectors;
export default authenticationSlice.reducer;
