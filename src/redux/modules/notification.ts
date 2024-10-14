import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, select, take } from "redux-saga/effects";
import { Notification, Page } from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common.ts";
import { notification } from "antd";
import {
  getNotificationsPage,
  markIsReadNotification,
} from "@/utils/api/notification.ts";
import { RootState } from "@/redux/store.ts";

export type NotificationState = {
  readonly page: Page<Notification[]>;
  readonly isFetchLoading: boolean;
};

const initialState: NotificationState = {
  page: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
    empty: true,
  },
  isFetchLoading: true,
};

const SLIDE_NAME = "notification";
export const notificationsSlice = createSlice({
  name: SLIDE_NAME,
  initialState,
  reducers: {
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchNotificationsSuccess: (
      state,
      action: PayloadAction<{ page: Page<Notification[]> }>,
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchNotificationsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    markReadNotificationSuccess: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              read: true,
            }
          }
          return it;
        }),
      },
    }),
    pushNotificationSuccess: (
      state,
      action: PayloadAction<{ notification: Notification }>,
    ) => {
      return {
        ...state,
        page: {
          ...state.page,
          content: [action.payload.notification, ...state.page.content],
          totalElements: state.page.totalElements + 1,
          empty: false,
          last: false,
          numberOfElements: state.page.numberOfElements + 1,
          size: state.page.size + 1,
          number: state.page.number + 1,
          totalPages: state.page.totalPages + 1,
          first: false,
        },
      };
    },
  },
});

export default notificationsSlice.reducer;

export const {
  updateFetchLoading,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  markReadNotificationSuccess,
  pushNotificationSuccess,
} = notificationsSlice.actions;

export const fetchNotificationsAction = createAction<{
  queryParams: QueryParams;
}>(`${SLIDE_NAME}/fetchNotificationsRequest`);
export const markIsReadNotificationsAction = createAction<{
  id: string;
}>(`${SLIDE_NAME}/markIsReadNotificationsRequest`);

function* handleFetchingNotifications() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchNotificationsAction> = yield take(
      fetchNotificationsAction,
    );
    try {
      yield put(updateFetchLoading());
      const page: Page<Notification[]> = yield call(
        getNotificationsPage,
        queryParams,
      );
      yield put(fetchNotificationsSuccess({ page }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(fetchNotificationsFailure());
    }
  }
}

function* handleMarkIsReadNotification() {
  while (true) {
    const {
      payload: { id },
    }: ReturnType<typeof markIsReadNotificationsAction> = yield take(
      markIsReadNotificationsAction,
    );
    try {
      const notification: Notification = yield select((state: RootState) =>
        state.notification.page.content.find((it) => it.id === id),
      );
      if (notification && !notification.read) {
        yield call(markIsReadNotification, id);
        yield put(markReadNotificationSuccess({ id }));
      }
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });
    }
  }
}

function* handleUpdatingNotification() {}
export const notificationSagas = [
  fork(handleFetchingNotifications),
  fork(handleUpdatingNotification),
  fork(handleMarkIsReadNotification),
];
