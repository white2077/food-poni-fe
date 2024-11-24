import { LoginRequest } from "@/components/pages/LoginPage";
import { AuthResponse, CurrentUser, UserRemember } from "@/type/types.ts";
import {
  login,
  registerUser,
  updateCurrentUserAddress,
} from "@/utils/api/auth.ts";
import { REMEMBER_ME } from "@/utils/server.ts";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { call, fork, put, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";
import { SignUpRequest } from "@/components/pages/SignUpPage.tsx";
import { persistToken } from "@/utils/axiosConfig.ts";

export type AuthState = {
  readonly currentUser: CurrentUser | null;
  readonly isPending: boolean;
};

const initialState: AuthState = {
  currentUser: null,
  isPending: false,
};

const SLICE_NAME = "auth";

const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updatePendingForLoginOrSignUpSuccess: (state) => ({
      ...state,
      isPending: true,
    }),
    loginSuccess: (state) => ({
      ...state,
      isPending: false,
    }),
    loginFailure: (state) => ({
      ...state,
      isPending: false,
    }),
    updateCurrentUserSuccess: (
      state,
      action: PayloadAction<AuthState["currentUser"]>,
    ) => ({
      ...state,
      currentUser: action.payload,
    }),
    updateCurrentUserAddressSuccess: (
      state,
      action: PayloadAction<{ aid: string }>,
    ) => ({
      ...state,
      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            addressId: action.payload.aid,
          }
        : null,
    }),
    registerUserSuccess: (state) => ({
      ...state,
      isPending: false,
    }),
    registerUserFailure: (state) => ({
      ...state,
      isPending: false,
    }),
  },
});

export const {
  updatePendingForLoginOrSignUpSuccess,
  loginSuccess,
  loginFailure,
  updateCurrentUserSuccess,
  updateCurrentUserAddressSuccess,
  registerUserSuccess,
  registerUserFailure,
} = authSlice.actions;

export default authSlice.reducer;

export const registerAction = createAction<{
  values: SignUpRequest;
  clearForm: () => void;
}>(`${SLICE_NAME}/registerRequest`);

export const updateCurrentUserAddressAction = createAction<{ aid: string }>(
  `${SLICE_NAME}/updateCurrentUserAddressRequest`,
);

export const loginAction = createAction<{
  values: LoginRequest;
}>(`${SLICE_NAME}/loginRequest`);

function* handleLogin() {
  while (true) {
    const {
      payload: { values },
    }: ReturnType<typeof loginAction> = yield take(loginAction);
    try {
      yield put(updatePendingForLoginOrSignUpSuccess());
      const user = {
        [values.username.includes("@") ? "email" : "username"]: values.username,
        password: values.password,
      };

      const res: AuthResponse = yield call(login, user);

      yield put(updateCurrentUserSuccess(persistToken(res)));

      Cookies.remove(REMEMBER_ME);
      if (values.remember) {
        const userRemember: UserRemember = {
          username: values.username,
          password: values.password,
          avatar: "currentUser.avatar",
        };
        Cookies.set(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {
          expires: 7,
        });
      } else Cookies.remove(REMEMBER_ME);

      window.location.href = "/";
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(loginFailure());
    }
  }
}

function* handleRegister() {
  while (true) {
    const {
      payload: { values, clearForm },
    }: ReturnType<typeof registerAction> = yield take(registerAction.type);

    try {
      yield put(updatePendingForLoginOrSignUpSuccess());
      yield call(registerUser, values);
      yield put(registerUserSuccess());

      clearForm();
      window.location.href = "/login";
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(registerUserFailure(e.response?.data || {}));
    }
  }
}

function* handleUpdateCurrentUserAddress() {
  while (true) {
    const {
      payload: { aid },
    }: ReturnType<typeof updateCurrentUserAddressAction> = yield take(
      updateCurrentUserAddressAction,
    );
    try {
      yield call(updateCurrentUserAddress, aid);
      yield put(updateCurrentUserAddressSuccess({ aid }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
    }
  }
}

export const authSagas = [
  fork(handleLogin),
  fork(handleRegister),
  fork(handleUpdateCurrentUserAddress),
];
