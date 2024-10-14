import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthRequest,
  AuthResponse,
  UserRemember,
} from "@/type/types.ts";
import { call, fork, put, select, take } from "redux-saga/effects";
import { notification } from "antd";
import { FieldLoginType } from "@/app/modules/auth/components/login.tsx";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { REFRESH_TOKEN, REMEMBER_ME } from "@/utils/server.ts";
import { login, registerUser } from "@/utils/api/auth.ts";
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
  readonly currentUser: {
    readonly role: string;
    readonly id: string;
    readonly avatar: string;
    readonly email: string;
    readonly addressId: string;
    readonly username: string;
  } | null | undefined;
  readonly register: {
    readonly isLoading: boolean;
    readonly errors: Record<string, string>;
  };
  readonly formEditing: {
    readonly fields: Array<{
      readonly field: string;
      readonly value: string;
      readonly errorMessage: string | null;
    }>;
    readonly isDirty: boolean;
  };
  readonly formSaved: {
    readonly fields: Array<{
      readonly field: string;
      readonly value: string;
    }> | null;
  };
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
  currentUser: undefined,
  register: {
    isLoading: false,
    errors: {},
  },
  formEditing: {
    fields: [
      { field: "username", value: "", errorMessage: null },
      { field: "email", value: "", errorMessage: null },
      { field: "password", value: "", errorMessage: null },
    ],
    isDirty: false,
  },
  formSaved: { fields: null },
};

const SLICE_NAME = "auth";

const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<{ navigate: NavigateFunction }>) => ({
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
    updateUsername: (state, action: PayloadAction<string>) => ({
      ...state,
      login: {
        ...state.login,
        username: action.payload,
      },
    }),
    updatePassword: (state, action: PayloadAction<string>) => ({
      ...state,
      login: {
        ...state.login,
        password: action.payload,
      },
    }),
    rememberMeRequest: (state) => ({
      ...state,
      login: {
        ...state.login,
        remember: !state.login.remember,
      },
    }),
    updateRememberMe: (state, action: PayloadAction<UserRemember>) => ({
      ...state,
      login: {
        ...state.login,
        rememberMe: action.payload,
      },
    }),
    updateCurrentUser: (
      state,
      action: PayloadAction<AuthState["currentUser"]>
    ) => ({
      ...state,
      currentUser: action.payload,
    }),
    clearCurrentUser: (state) => ({
      ...state,
      currentUser: null,
    }),
    registerUserRequest: (state) => ({
      ...state,
      register: {
        ...state.register,
        isLoading: true,
      },
    }),
    registerUserSuccess: (state) => ({
      ...state,
      register: {
        ...state.register,
        isLoading: false,
      },
    }),
    registerUserFailure: (state, action: PayloadAction<Record<string, string>>) => ({
      ...state,
      register: {
        ...state.register,
        isLoading: false,
        errors: action.payload,
      },
    }),
    updateFormSavedSuccess: (
      state,
      action: PayloadAction<{
        fields: Array<{ field: string; value: string }>;
      }>,
    ) => ({
      ...state,
      formSaved: {
        ...state.formSaved,
        fields: action.payload.fields,
      },
    }),
    clearFormSuccess: (state) => {
      state.formEditing = {
        fields: [
          { field: "username", value: "", errorMessage: null },
          { field: "email", value: "", errorMessage: null },
          { field: "password", value: "", errorMessage: null },
        ],
        isDirty: false,
      };
      state.formSaved = { fields: null };
    },
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
  registerUserRequest,
  registerUserSuccess,
  registerUserFailure,
  updateFormSavedSuccess,
  clearFormSuccess,
} = authSlice.actions;

export default authSlice.reducer;

export const registerUserAction = createAction<{
  values: AuthRequest;
  navigate: NavigateFunction;
}>(`${SLICE_NAME}/registerUserAction`);

function* handleLogin() {
  while (true) {
    const { payload }: PayloadAction<{ navigate: NavigateFunction }> =
      yield take(loginRequest.type);
    try {
      const { username, password, remember }: FieldLoginType = yield select(
        (state: RootState) => state.auth.login
      );
      const user: AuthRequest = {
        username,
        password,
      };
      const res: AuthResponse = yield call(login, user);

      yield put(loginSuccess());
      yield put(
        updateCurrentUser(
          jwtDecode(res.refreshToken) as AuthState["currentUser"]
        )
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

function* handleRegisterUser() {
  while (true) {
    const {
      payload: { values, navigate },
    }: ReturnType<typeof registerUserAction> = yield take(
      registerUserAction.type
    );
    yield put(registerUserRequest());
    const formEditing: AuthState['formEditing'] = yield select(
      (state: RootState) => state.auth.formEditing
    );

    if (formEditing.fields.some((field) => field.errorMessage !== null)) {
      const errors = formEditing.fields.reduce((acc, field) => {
        if (field.errorMessage) {
          acc[field.field] = field.errorMessage; 
        }
        return acc;
      }, {} as Record<string, string>);
      
      yield put(registerUserFailure(errors));
      notification.error({
        message: "Đăng ký thất bại",
        description: "Vui lòng kiểm tra lại thông tin đăng ký.",
      });
      continue;
    }

    try {
      yield call(registerUser, values);
      yield put(registerUserSuccess());
      notification.success({
        message: "Đăng ký thành công",
        description: "Đăng ký tài khoản thành công!",
      });

      Cookies.set(
        REMEMBER_ME,
        btoa(
          JSON.stringify({ username: values.username, email: values.email })
        ),
        { expires: 30 }
      );

      yield put(clearFormSuccess());
      navigate("/auth/login");
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(
        registerUserFailure({ general: "Đăng ký thất bại. Vui lòng thử lại." })
      );
    }
  }
}

export const authSagas = [fork(handleLogin), fork(handleRegisterUser)];
