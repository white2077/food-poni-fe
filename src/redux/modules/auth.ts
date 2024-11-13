import { FieldLoginType } from "@/components/pages/LoginPage";
import { fetchCartGroupsRequest } from "@/redux/modules/cartGroup.ts";
import { RootState } from "@/redux/store.ts";
import {
  AuthRequest,
  AuthResponse,
  CurrentUser,
  User,
  UserRemember,
} from "@/type/types.ts";
import {
  getUserById,
  login,
  refreshToken,
  registerUser,
  updateCurrentUserAddress,
} from "@/utils/api/auth.ts";
import { setAccessToken } from "@/utils/axiosConfig";
import { REFRESH_TOKEN, REMEMBER_ME } from "@/utils/server.ts";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { NavigateFunction } from "react-router-dom";
import { call, fork, put, select, take } from "redux-saga/effects";

export type AuthState = {
  readonly login: {
    readonly username: string;
    readonly password: string;
    readonly remember: boolean;
    readonly rememberMe: UserRemember;
    readonly isPending: boolean;
  };
  readonly currentUser: CurrentUser | null;
  readonly isFetchingUser: boolean;
  readonly register: {
    readonly isLoading: boolean;
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
  currentUser: null,
  isFetchingUser: true,
  register: {
    isLoading: false,
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
    updatePendingSuccess: (state) => ({
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
    updateCurrentUserSuccess: (
      state,
      action: PayloadAction<AuthState["currentUser"]>
    ) => ({
      ...state,
      currentUser: action.payload,
      isFetchingUser: false,
    }),
    updateCurrentUserFailure: (state) => ({
      ...state,
      isFetchingUser: false,
    }),
    updateCurrentUserAddressSuccess: (
      state,
      action: PayloadAction<{ aid: string }>
    ) => ({
      ...state,
      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            addressId: action.payload.aid,
          }
        : null,
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
    registerUserFailure: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => ({
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
      }>
    ) => ({
      ...state,
      formSaved: {
        ...state.formSaved,
        fields: action.payload.fields,
      },
    }),
    updateFormEditingSuccess: (
      state,
      action: PayloadAction<{
        field: string;
        value: string;
      }>
    ) => {
      let errorMessage: string | null = null;

      switch (action.payload.field) {
        case "username":
          if (action.payload.value === "") {
            errorMessage = "Username không được để trống";
            break;
          }
          if (action.payload.value.includes(" ")) {
            errorMessage = "Username không hợp lệ";
            break;
          }
          if (action.payload.value.length < 6) {
            errorMessage = "Username phải có ít nhất 6 ký tự";
            break;
          }
          if (action.payload.value.length > 50) {
            errorMessage = "Username không được vượt quá 50 ký tự";
            break;
          }
          break;
        case "email":
          if (
            action.payload.value !== "" &&
            !/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(action.payload.value)
          ) {
            errorMessage = "Email không hợp lệ";
            break;
          }
          break;
        case "password":
          if (action.payload.value === "") {
            errorMessage = "Password không được để trống";
            break;
          }
          if (action.payload.value.includes(" ")) {
            errorMessage = "Password không hợp lệ";
            break;
          }
          if (action.payload.value.length < 6) {
            errorMessage = "Password phải có ít nhất 6 ký tự";
            break;
          }
          if (action.payload.value.length > 50) {
            errorMessage = "Password không được vượt quá 50 ký tự";
            break;
          }
          break;
      }

      const updatedFields = state.formEditing.fields.map((field) => {
        if (field.field === action.payload.field) {
          return {
            ...field,
            value: action.payload.value,
            errorMessage,
          };
        }
        return field;
      });

      if (errorMessage) {
        return {
          ...state,
          formEditing: {
            fields: updatedFields,
            isDirty: true,
          },
        };
      }

      const isDirty = updatedFields.every(
        (field) => field.errorMessage === null
      );

      return {
        ...state,
        formEditing: {
          fields: updatedFields,
          isDirty: !isDirty,
        },
      };
    },
    clearFormSuccess: (state) => ({
      ...state,
      formEditing: initialState.formEditing,
      formSaved: initialState.formSaved,
    }),
  },
});

export const {
  updatePendingSuccess,
  loginSuccess,
  loginFailure,
  updateUsername,
  updatePassword,
  rememberMeRequest,
  updateRememberMe,
  updateCurrentUserSuccess,
  updateCurrentUserFailure,
  updateCurrentUserAddressSuccess,
  clearCurrentUser,
  registerUserRequest,
  registerUserSuccess,
  registerUserFailure,
  updateFormSavedSuccess,
  updateFormEditingSuccess,
  clearFormSuccess,
} = authSlice.actions;

export default authSlice.reducer;

export const registerUserAction = createAction<{
  values: AuthRequest;
  navigate: NavigateFunction;
}>(`${SLICE_NAME}/registerUserAction`);

export const updateCurrentUserAddressAction = createAction<{ aid: string }>(
  `${SLICE_NAME}/updateCurrentUserAddressRequest`
);

export const loginAction = createAction<{ navigate: NavigateFunction }>(
  `${SLICE_NAME}/loginRequest`
);

export const fetchUserAction = createAction<{ uid: string }>(
  `${SLICE_NAME}/fetchUserRequest`
);

function* handleLogin() {
  while (true) {
    yield take(loginAction);
    try {
      yield put(updatePendingSuccess());
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
        updateCurrentUserSuccess(
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

      window.location.href = "/";
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(loginFailure());
    }
  }
}

function* handleRegisterUser() {
  while (true) {
    const {
      payload: { values },
    }: ReturnType<typeof registerUserAction> = yield take(
      registerUserAction.type
    );

    try {
      yield put(registerUserRequest());

      yield call(registerUser, values);

      const loginRes: AuthResponse = yield call(login, {
        username: values.username,
        password: values.password,
      });

      yield put(registerUserSuccess());

      yield put(
        updateCurrentUserSuccess(
          jwtDecode(loginRes.refreshToken) as AuthState["currentUser"]
        )
      );

      Cookies.set(REFRESH_TOKEN, loginRes.refreshToken, { expires: 7 });

      window.location.href = "/";
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(registerUserFailure(e.response?.data || {}));
    }
  }
}

function* handleUpdateCurrentUserAddress() {
  while (true) {
    const {
      payload: { aid },
    }: ReturnType<typeof updateCurrentUserAddressAction> = yield take(
      updateCurrentUserAddressAction
    );
    try {
      yield call(updateCurrentUserAddress, aid);
      yield put(updateCurrentUserAddressSuccess({ aid }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });
    }
  }
}

function* handleFetchUser() {
  while (true) {
    const {
      payload: { uid },
    }: ReturnType<typeof fetchUserAction> = yield take(fetchUserAction);
    try {
      const user: User = yield call(getUserById, uid);

      const auth: AuthResponse = yield call(refreshToken);
      setAccessToken(auth.accessToken);

      if (!(user.role === "RETAILER")) {
        yield put(fetchCartGroupsRequest());
      }

      yield put(
        updateCurrentUserSuccess({
          id: user.id,
          avatar: user.avatar,
          role: user.role,
          email: user.email,
          addressId: user.address && user.address.id,
          username: user.username,
        })
      );
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(updateCurrentUserFailure());
    }
  }
}

export const authSagas = [
  fork(handleLogin),
  fork(handleRegisterUser),
  fork(handleUpdateCurrentUserAddress),
  fork(handleFetchUser),
];
