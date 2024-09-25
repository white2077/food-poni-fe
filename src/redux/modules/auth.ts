import {createAction, createSlice} from "@reduxjs/toolkit";
import {AuthRequest, AuthResponse, CurrentUser, UserRemember} from "@/type/types.ts";
import {call, fork, put, take} from "redux-saga/effects";
import {notification} from "antd";
import {FieldLoginType} from "@/app/modules/auth/components/login.tsx";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import {REFRESH_TOKEN, REMEMBER_ME} from "@/utils/server.ts";
import {login} from "@/utils/api/auth.ts";

export type AuthState = {
    readonly login: {
        readonly rememberMe: UserRemember,
        readonly isPending: boolean,
    },
    readonly currentUser: CurrentUser,
}

const initialState: AuthState = {
    login: {
        rememberMe: {
            username: "",
            password: "",
            avatar: "",
        },
        isPending: false,
    },
    currentUser: {
        id: "",
        sub: "",
        role: "",
        avatar: "",
        addressId: "",
        username: "",
        email: ""
    }
};

const SLIDE_NAME = 'auth';

const cartSlide = createSlice({
    name: SLIDE_NAME,
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.login.isPending = true;
        },
        loginSuccess: (state) => {
            state.login.isPending = false;
        },
        loginFailure: (state) => {
            state.login.isPending = false;
        },
        rememberMeSuccess: (state, action: { payload: UserRemember }) => (
            {
                ...state,
                login: {
                    ...state.login,
                    rememberMe: action.payload
                }
            }
        ),
        updateCurrentUser: (state, action: { payload: CurrentUser }) => {
            state.currentUser = action.payload;
        },
        clearCurrentUser: (state) => {
            state.currentUser = initialState.currentUser;
        }
    }
});

export const {
    clearCurrentUser,
    loginRequest,
    loginSuccess,
    loginFailure,
    rememberMeSuccess,
    updateCurrentUser,
} = cartSlide.actions;
export default cartSlide.reducer;

export const loginActionRequest = createAction<FieldLoginType>(SLIDE_NAME + '/loginActionRequest');

function* handleLogin() {
    while (true) {
        const {payload}: ReturnType<typeof loginActionRequest> = yield take(loginActionRequest.type);

        try {
            yield put(loginRequest());
            const user: AuthRequest = payload.username.includes("@")
                ? {username: null, email: payload.username, password: payload.password}
                : {username: payload.username, email: null, password: payload.password}

            const res: AuthResponse = yield call(login, user);

            yield put(loginSuccess());
            yield put(updateCurrentUser(jwtDecode(res.refreshToken) as CurrentUser));

            Cookies.set(REFRESH_TOKEN, res.refreshToken, {expires: 7});

            Cookies.remove(REMEMBER_ME);
            //set user remembered and delete
            if (payload.remember) {
                const userRemember: UserRemember = {
                    username: user.username ? user.username! : user.email!,
                    password: user.password,
                    avatar: "currentUser.avatar"
                }
                Cookies.set(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {expires: 7});
            } else Cookies.remove(REMEMBER_ME);

            // navigate('/');

        } catch (e) {
            notification.open({
                type: 'error',
                message: 'Đăng nhập',
                description: e.message,
            });
            yield put(loginFailure());
        }
    }
}

export const authSagas = [fork(handleLogin),];