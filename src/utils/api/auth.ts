import { AxiosResponse } from "axios";
import { AuthRequest, AuthResponse, CurrentUser } from "@/type/types.ts";
import { api } from "@/utils/axiosConfig.ts";

export const login = (user: AuthRequest): Promise<AuthResponse> => {
  return api
    .post("/auth/login", user)
    .then((res: AxiosResponse<AuthResponse>) => res.data);
};

export const registerUser = async (user: AuthRequest): Promise<CurrentUser> => {
  const res: AxiosResponse<CurrentUser> = await api.post("/users", user);
  return res.data;
};
