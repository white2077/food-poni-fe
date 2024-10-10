import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, take } from "redux-saga/effects";

export type NotificationState = {
  readonly data: NotificationAPIResponse[];
  readonly isLoading: boolean;
};

const initialState: NotificationState = {
  data: [],
  isLoading: true,
};

const SLIDE_NAME = "notification";
export const notificationsSlice = createSlice({
  name: SLIDE_NAME,
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<NotificationAPIResponse[]>,
    ) => {
      state.data = action.payload;
      state.isLoading = false;
      return state;
    },
    addNotification: (
      state,
      action: PayloadAction<NotificationAPIResponse>,
    ) => {
      state.data.push(action.payload);
      return state;
    },
    markIsReadNotification: (state, action: PayloadAction<string>) => {
      let noti: NotificationAPIResponse = state.data.find(
        (item: NotificationAPIResponse) => item.id === action.payload,
      )!;
      noti.read = true;
      return state;
    },
  },
});

export default notificationsSlice.reducer;

function* handleFetchingNotification() {
  // yield put(setNotifications())
}

function* handleUpdatingNotification() {}
export const notificationSagas = [
  fork(handleFetchingNotification),
  fork(handleUpdatingNotification),
];
