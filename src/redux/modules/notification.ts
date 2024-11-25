import { RootState } from "@/redux/store.ts";
import { Notification, Page } from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common.ts";
import {
  getNotificationsPage,
  markIsReadNotification,
} from "@/utils/api/notification.ts";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, select, take, race } from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type NotificationState = {
  readonly page: Page<
    Array<Notification & { readonly isMarkLoading: boolean }>
  >;
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
      action: PayloadAction<{ page: NotificationState["page"] }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchNotificationsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForMarkingReadSuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              isMarkLoading: true,
            };
          }
          return it;
        }),
      },
    }),
    markReadNotificationSuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              read: true,
              isMarkLoading: false,
            };
          }
          return it;
        }),
      },
    }),
    markReadNotificationFailure: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              isMarkLoading: false,
            };
          }
          return it;
        }),
      },
    }),
    pushNotificationSuccess: (
      state,
      action: PayloadAction<{
        notification: NotificationState["page"]["content"][0];
      }>
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
    pushNotificationsSuccess: (
      state,
      action: PayloadAction<{ page: NotificationState["page"] }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: [...state.page.content, ...action.payload.page.content],
        number: action.payload.page.number,
        last: action.payload.page.last,
      },
      isFetchLoading: false,
    }),
    pushNotificationsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
  },
});

export default notificationsSlice.reducer;

export const {
  updateFetchLoading,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  updateLoadingForMarkingReadSuccess,
  markReadNotificationSuccess,
  markReadNotificationFailure,
  pushNotificationSuccess,
  pushNotificationsSuccess,
  pushNotificationsFailure,
} = notificationsSlice.actions;

export const fetchNotificationsAction = createAction<{
  queryParams: QueryParams;
}>(`${SLIDE_NAME}/fetchNotificationsRequest`);
export const markIsReadNotificationsAction = createAction<{
  id: string;
}>(`${SLIDE_NAME}/markIsReadNotificationsRequest`);
export const pushNotificationsAction = createAction<{
  queryParams: QueryParams;
}>(`${SLIDE_NAME}/pushNotificationsRequest`);

function* handleFetchingNotifications() {
  while (true) {
    const {
      fetchNotification,
      pushNotifications,
    }: {
      fetchNotification: ReturnType<typeof fetchNotificationsAction>;
      pushNotifications: ReturnType<typeof pushNotificationsAction>;
    } = yield race({
      fetchNotification: take(fetchNotificationsAction),
      pushNotifications: take(pushNotificationsAction),
    });
    try {
      yield put(updateFetchLoading());
      if (fetchNotification) {
        const page: Page<Notification[]> = yield call(
          getNotificationsPage,
          fetchNotification.payload.queryParams
        );
        yield put(
          fetchNotificationsSuccess({
            page: {
              ...page,
              content: page.content.map((it) => ({
                ...it,
                isMarkLoading: false,
              })),
            },
          })
        );
      }

      if (pushNotifications) {
        const page: Page<Notification[]> = yield call(
          getNotificationsPage,
          pushNotifications.payload.queryParams
        );
        yield put(
          pushNotificationsSuccess({
            page: {
              ...page,
              content: page.content.map((it) => ({
                ...it,
                isMarkLoading: false,
              })),
            },
          })
        );
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchNotificationsFailure());
    }
  }
}

function* markIsRead(id: string) {
  const notification: Notification = yield select((state: RootState) =>
    state.notification.page.content.find((it) => it.id === id)
  );
  if (notification && !notification.read) {
    yield call(markIsReadNotification, id);
    yield put(markReadNotificationSuccess({ id }));
  }
}

function* handleMarkIsReadNotification() {
  while (true) {
    const {
      payload: { id },
    }: ReturnType<typeof markIsReadNotificationsAction> = yield take(
      markIsReadNotificationsAction
    );
    try {
      yield put(updateLoadingForMarkingReadSuccess({ id }));
      yield fork(markIsRead, id);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(markReadNotificationFailure({ id }));
    }
  }
}

function* handleUpdatingNotification() {}
export const notificationSagas = [
  fork(handleFetchingNotifications),
  fork(handleUpdatingNotification),
  fork(handleMarkIsReadNotification),
];
