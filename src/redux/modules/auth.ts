import { createSlice } from "@reduxjs/toolkit";
import { AuthRequest, AuthResponse, UserRemember } from "@/type/types.ts";
import { call, fork, put, select, take } from "redux-saga/effects";
import { notification } from "antd";
import { FieldLoginType } from "@/app/modules/auth/components/login.tsx";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { REFRESH_TOKEN, REMEMBER_ME } from "@/utils/server.ts";
import { login } from "@/utils/api/auth.ts";
import { RootState } from "@/redux/store.ts";
import { NavigateFunction } from "react-router-dom";

export type AuthState = {
  readonly login: {
    readonly username: string;
    readonly password: string;
    readonly remember: boolean;
    readonly rememberMe: UserRemember;
    readonly isPending: boolean;
  };
  readonly currentUser:
    | {
        readonly role: string;
        readonly id: string;
        readonly avatar: string;
        readonly email: string;
        readonly addressId: string;
        readonly username: string;
      }
    | null
    | undefined;
};

const initialState: AuthState = {
  login: {
    username: "",
    password: "",
    remember: true,
    rememberMe: {
      username: "",
      password: "",
      avatar: "",
    },
    isPending: false,
  },
  currentUser: null,
};

const SLIDE_NAME = "auth";

const cartSlide = createSlice({
  name: SLIDE_NAME,
  initialState,
  reducers: {
    loginRequest: (
      state,
      action: { payload: { navigate: NavigateFunction } },
    ) => ({
      ...state,
      login: {
        ...state.login,
        isPending: true,
      },
    }),
    loginSuccess: (state) => ({
      ...state,
      login: {
        ...state.login,
        isPending: false,
      },
    }),
    loginFailure: (state) => ({
      ...state,
      login: {
        ...state.login,
        isPending: false,
      },
    }),
    updateUsername: (state, action: { payload: string }) => ({
      ...state,
      login: {
        ...state.login,
        username: action.payload,
      },
    }),
    updatePassword: (state, action: { payload: string }) => ({
      ...state,
      login: {
        ...state.login,
        password: action.payload,
      },
    }),
    rememberMeRequest: (state, action: { payload: boolean }) => ({
      ...state,
      login: {
        ...state.login,
        remember: action.payload,
      },
    }),
    updateRememberMe: (state, action: { payload: UserRemember }) => ({
      ...state,
      login: {
        ...state.login,
        rememberMe: action.payload,
      },
    }),
    updateCurrentUser: (
      state,
      action: {
        payload: {
          readonly role: string;
          readonly id: string;
          readonly avatar: string;
          readonly email: string;
          readonly addressId: string;
          readonly username: string;
        };
      },
    ) => ({
      ...state,
      currentUser: action.payload,
    }),
    clearCurrentUser: (state) => ({
      ...state,
      currentUser: initialState.currentUser,
    }),
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  updateUsername,
  updatePassword,
  rememberMeRequest,
  updateRememberMe,
  updateCurrentUser,
  clearCurrentUser,
} = cartSlide.actions;
export default cartSlide.reducer;

function* handleLogin() {
  while (true) {
    const { payload }: ReturnType<typeof loginRequest> = yield take(
      loginRequest,
    );
    try {
      const { username, password, remember }: FieldLoginType = yield select(
        (state: RootState) => state.auth.login,
      );
      const user: AuthRequest = {
        username,
        password,
      };
      const res: AuthResponse = yield call(login, user);

      yield put(loginSuccess());
      yield put(
        updateCurrentUser(
          jwtDecode(res.refreshToken) as {
            readonly role: string;
            readonly id: string;
            readonly avatar: string;
            readonly email: string;
            readonly addressId: string;
            readonly username: string;
          },
        ),
      );

      Cookies.set(REFRESH_TOKEN, res.refreshToken, { expires: 7 });
      Cookies.remove(REMEMBER_ME);

      if (remember) {
        const userRemember: UserRemember = {
          username: user.username ? user.username! : user.email!,
          password: user.password,
          avatar: "currentUser.avatar",
        };
        yield put(updateRememberMe(userRemember));
        Cookies.set(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {
          expires: 7,
        });
      } else Cookies.remove(REMEMBER_ME);

      payload.navigate("/");
    } catch (e) {
      notification.open({
        type: "error",
        message: "Đăng nhập",
        description: e.message,
      });
      yield put(loginFailure());
    }
  }
}

export const authSagas = [fork(handleLogin)];
