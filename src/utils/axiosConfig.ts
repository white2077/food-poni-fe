import axios, { AxiosError, AxiosResponse } from "axios";
import { REFRESH_TOKEN, server } from "./server";
import Cookies from "js-cookie";
import { AuthResponse, CurrentUser, Error } from "@/type/types.ts";
import { refreshToken } from "./api/auth";
import jwtDecode from "jwt-decode";

export let accessToken: string | null;

export const persistToken = (tokens: AuthResponse) => {
  accessToken = tokens.accessToken;
  Cookies.set(REFRESH_TOKEN, tokens.refreshToken, { expires: 7 });

  return jwtDecode(tokens.accessToken) as CurrentUser;
};

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

const promises: Array<Promise<AxiosResponse>> = [];
export const apiWithToken = () => {
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        const refresh = refreshToken()
          .then((res: AuthResponse) => {
            persistToken(res);

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
          })
          .finally(() => {
            if (promises.length > 0) {
              promises.slice(0, promises.length);
            }
          });
        promises.push(refresh);
        if (promises.length === 1) {
          return refresh;
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
};
