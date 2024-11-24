import { AxiosResponse } from "axios";
import { AuthResponse, CurrentUser } from "@/type/types.ts";
import { accessToken, api, apiWithToken } from "@/utils/axiosConfig.ts";
import generateQueryString from "./common";
import { REFRESH_TOKEN } from "../server";
import Cookies from "js-cookie";
import { SignUpRequest } from "@/components/pages/SignUpPage.tsx";

export const login = (values: {
  [x: string]: string;
  password: string;
}): Promise<AuthResponse> => {
  return api
    .post("/auth/login", values)
    .then((res: AxiosResponse<AuthResponse>) => res.data);
};

export const refreshToken = (): Promise<AuthResponse> => {
  return api
    .post("/auth/refresh-token", { refreshToken: Cookies.get(REFRESH_TOKEN) })
    .then((res: AxiosResponse<AuthResponse>) => res.data);
};

export const registerUser = (values: SignUpRequest): Promise<CurrentUser> => {
  return api
    .post("/users", values)
    .then((res: AxiosResponse<CurrentUser>) => res.data);
};

export const updateCurrentUserAddress = (aid: string): Promise<void> => {
  return apiWithToken().patch(
    generateQueryString("/users/update-address"),
    { id: aid },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );
};
