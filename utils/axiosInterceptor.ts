import axiosConfig from "./axios-config";
import {getCookie, setCookie} from "cookies-next";
import {REFRESH_TOKEN, server} from "./server";
import axios, {AxiosError} from "axios";
import {AuthenticationResponse} from "../models/auth/AuthenticationResponse";

const axiosInterceptor = axiosConfig;

axiosInterceptor.interceptors.request.use(
    async (config) => {

        // Kiem tra xem refresh token co ton tai hay khong
        const refreshTokenCurrent = getCookie(REFRESH_TOKEN);

        if (refreshTokenCurrent) {
            try {
                // Lay token
                const response = await axios.post(
                    server + '/auth/refresh-token',
                    {
                        'refreshToken': refreshTokenCurrent
                    }
                );

                const {accessToken, refreshToken}: AuthenticationResponse = response.data;

                if (accessToken) {
                    // Cap nhat accessToken vao header
                    config.headers.Authorization = `Bearer ${accessToken}`;

                    // Cap nhat lai refreshToken trong cookie
                    setCookie(REFRESH_TOKEN, refreshToken, {
                        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
                    });
                }
            } catch (error) {
                // Loi khi refresh token
                console.error('Error refreshing token:', error);
            }
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default axiosInterceptor;