import axios, {AxiosError, AxiosResponse} from "axios";
import {REFRESH_TOKEN, server} from "./server";
import {AuthAPIResponse} from "../models/auth/AuthAPIResponse";
import {CookieValueTypes, deleteCookie} from "cookies-next";
import {ErrorApiResponse} from "../models/ErrorApiResponse";

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
                .catch((res: AxiosError<ErrorApiResponse>) => {
                    // alert(res.response ? res.response.data.error.message : res.message);
                    console.log(res.message);
                    window.location.href = "/login";
                    deleteCookie(REFRESH_TOKEN);
                });
        }
        return Promise.reject(error);
    });
    return api;
}