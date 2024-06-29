import axios, {AxiosError, AxiosResponse} from "axios";
import {server} from "./server";
import {AuthenticationResponse} from "../models/auth/AuthenticationResponse";
import {Dispatch} from "redux";
import {CurrentUser, setCurrentUser} from "../stores/user.reducer";
import jwtDecode from "jwt-decode";

export let accessToken: string | null;

export const api = axios.create({
    baseURL: server + '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const apiWithToken = (dispatch: Dispatch, refreshToken: string) => {
    api.interceptors.response.use((response: AxiosResponse) => {
        return response;
    }, (error: AxiosError) => {
        if (error.response && error.response.status === 401) {

            return api.post("/auth/refresh-token", {refreshToken})
                .then((res: AxiosResponse<AuthenticationResponse>) => {
                    accessToken = res.data.accessToken;
                    if (error.config) {
                        const currentUser: CurrentUser = jwtDecode(accessToken);
                        dispatch(setCurrentUser(currentUser));
                        error.config.headers.Authorization = `Bearer ${accessToken}`;

                        return api(error.config);
                    }
                    return Promise.reject(error);
                })
                .catch((err: AxiosError) => {

                });
        }
        return Promise.reject(error);
    });
    return api;
}