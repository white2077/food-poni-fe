import axios, { AxiosError, AxiosResponse } from "axios";
import { REFRESH_TOKEN, server } from "./server";
import Cookies from "js-cookie";
import { AuthResponse, Error } from "@/type/types.ts";
import { refreshToken } from "./api/auth";

export let accessToken: string | null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const api = axios.create({
  baseURL: server + "/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
});

export const apiWithToken = () => {
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        return refreshToken()
          .then((res: AuthResponse) => {
            accessToken = res.accessToken;
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
    }
  );
  return api;
};
