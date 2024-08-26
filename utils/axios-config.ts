import axios, {AxiosError, AxiosResponse} from "axios";
import {REFRESH_TOKEN, server} from "./server";
import {AuthAPIResponse} from "../models/auth/AuthAPIResponse";
import {CookieValueTypes, deleteCookie} from "cookies-next";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";

export let accessToken: string | null;

export const api = axios.create({
    baseURL: server + '/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // "ngrok-skip-browser-warning": "true",
    },
});

export const apiWithToken = (refreshToken: CookieValueTypes) => {
    api.interceptors.response.use((response: AxiosResponse) => {
        return response;
    }, (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            return api.post("/auth/refresh-token", {refreshToken})
                .then((res: AxiosResponse<AuthAPIResponse>) => {
                    accessToken = res.data.accessToken;
                    if (error.config) {
                        error.config.headers.Authorization = `Bearer ${accessToken}`;

                        return api(error.config);
                    }
                    return Promise.reject(error);
                })
                .catch((res: AxiosError<ErrorAPIResponse>) => {
                    if (res.status && res.status === 401) {
                        deleteCookie(REFRESH_TOKEN);
                    }
                    throw res;
                });
        }
        return Promise.reject(error);
    });
    return api;
}