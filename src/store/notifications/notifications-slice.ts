import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../slice";
import {
  apiGetNotificationsAction,
  IGetNotificationsResponseData,
  INotificationItems,
  TGetNotificationsParams,
} from "@/features/notifications";
import { TStatus } from "@/types";

type TNotificationsState = {
  getNotifications: {
    status: TStatus;
    message?: string;
    data?: IGetNotificationsResponseData;
    /** Usuario para el que ya se pidió el listado (evita datos de otra sesión). */
    sessionKey?: string;
  };
};

const initialState: TNotificationsState = {
  getNotifications: {
    status: "idle",
    message: undefined,
    data: undefined,
    sessionKey: undefined,
  },
};

const notificationsSlice = createAppSlice({
  name: "notifications",
  initialState,
  reducers: (create) => ({
    getNotifications: create.asyncThunk(
      async (params?: TGetNotificationsParams & { sessionKey?: string }) => {
        const { sessionKey: _sessionKey, ...apiParams } = params ?? {};
        return apiGetNotificationsAction(apiParams);
      },
      {
        pending: (state, action) => {
          state.getNotifications.status = "loading";
          const sessionKey = action.meta.arg?.sessionKey;
          if (sessionKey) {
            state.getNotifications.sessionKey = sessionKey;
          }
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.getNotifications.status = "error";
            state.getNotifications.message = action.payload.message;
            if ((action.meta.arg?.Page ?? 1) <= 1) {
              state.getNotifications.data = undefined;
            }
            return;
          }

          const next = action.payload.data;
          const requestedPage = action.meta.arg?.Page ?? next.page;
          const previousItems =
            requestedPage > 1 ? (state.getNotifications.data?.items ?? []) : [];

          state.getNotifications.status = "success";
          state.getNotifications.message = action.payload.message;
          state.getNotifications.data = {
            ...next,
            items:
              requestedPage > 1
                ? [...previousItems, ...next.items]
                : next.items,
          };
        },
        rejected: (state, action) => {
          state.getNotifications.status = "error";
          state.getNotifications.message = action.error.message;
          if ((action.meta.arg?.Page ?? 1) <= 1) {
            state.getNotifications.data = undefined;
          }
        },
      },
    ),
    resetGetNotifications: create.reducer((state) => {
      state.getNotifications = initialState.getNotifications;
    }),
    prependNotification: create.reducer(
      (state, action: PayloadAction<INotificationItems>) => {
        const incoming = action.payload;
        const current = state.getNotifications.data;

        if (!current) {
          state.getNotifications.status = "success";
          state.getNotifications.data = {
            items: [incoming],
            page: 1,
            size: 10,
            totalItems: 1,
            totalPages: 1,
          };
          return;
        }

        if (
          current.items.some(
            (item) => item.idNotification === incoming.idNotification,
          )
        ) {
          return;
        }

        current.items = [incoming, ...current.items];
        current.totalItems += 1;
      },
    ),
    markNotificationAsViewed: create.reducer(
      (state, action: PayloadAction<number>) => {
        const item = state.getNotifications.data?.items.find(
          (n) => n.idNotification === action.payload,
        );
        if (item) item.isViewed = true;
      },
    ),
    markAllNotificationsAsViewed: create.reducer((state) => {
      const items = state.getNotifications.data?.items;
      if (!items) return;
      for (const item of items) {
        item.isViewed = true;
      }
    }),
  }),
  selectors: {
    selectGetNotifications: (state) => state.getNotifications,
  },
});

export const {
  getNotifications,
  resetGetNotifications,
  prependNotification,
  markNotificationAsViewed,
  markAllNotificationsAsViewed,
} = notificationsSlice.actions;
export const { selectGetNotifications } = notificationsSlice.selectors;

export default notificationsSlice.reducer;
