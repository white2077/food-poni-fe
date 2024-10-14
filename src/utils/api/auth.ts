import { AxiosResponse } from "axios";
import { AuthRequest, AuthResponse, CurrentUser } from "@/type/types.ts";
import { accessToken, api, apiWithToken } from "@/utils/axiosConfig.ts";
import generateQueryString from "./common";

export const login = (user: AuthRequest): Promise<AuthResponse> => {
  return api
    .post("/auth/login", user)
    .then((res: AxiosResponse<AuthResponse>) => res.data);
};

export const registerUser = async (user: AuthRequest): Promise<CurrentUser> => {
  const res: AxiosResponse<CurrentUser> = await api.post("/users", user);
  return res.data;
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
