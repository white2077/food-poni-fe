import axios, {AxiosError, AxiosResponse} from "axios";
import {REFRESH_TOKEN, server} from "./server";
import Cookies from "js-cookie";
import {AuthResponse, Error} from "@/type/types.ts";

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

export const apiWithToken = () => {
    api.interceptors.response.use((response: AxiosResponse) => {
        return response;
    }, (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            return api.post("/auth/refresh-token", {refreshToken: Cookies.get(REFRESH_TOKEN)})
                .then((res: AxiosResponse<AuthResponse>) => {
                    accessToken = res.data.accessToken;
                    if (error.config) {
                        error.config.headers.Authorization = `Bearer ${accessToken}`;

                        return api(error.config);
                    }
                    return Promise.reject(error);
                })
                .catch((res: AxiosError<Error>) => {
                    if (res.status && res.status === 401) {
                        Cookies.remove(REFRESH_TOKEN);
                        window.location.href = "/login";
                    }
                    throw res;
                });
        }
        return Promise.reject(error);
    });
    return api;
}