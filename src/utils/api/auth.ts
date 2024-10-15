import { AxiosResponse } from "axios";
import { AuthRequest, AuthResponse, CurrentUser, User } from "@/type/types.ts";
import { accessToken, api, apiWithToken } from "@/utils/axiosConfig.ts";
import generateQueryString from "./common";

export const login = (user: AuthRequest): Promise<AuthResponse> => {
  return api
    .post("/auth/login", user)
    .then((res: AxiosResponse<AuthResponse>) => res.data);
};

export const registerUser = (user: AuthRequest): Promise<CurrentUser> => {
  return api
    .post("/users", user)
    .then((res: AxiosResponse<CurrentUser>) => res.data);
};

export const getUserById = (uid: string): Promise<User> => {
  return api
    .get(generateQueryString(`/users/${uid}`))
    .then((res: AxiosResponse<User>) => res.data);
};

export const updateCurrentUserAddress = (aid: string): Promise<void> => {
  return apiWithToken().patch(
    generateQueryString("/users/update-address"),
    { id: aid },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
};
