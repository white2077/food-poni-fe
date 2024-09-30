import {AxiosResponse} from "axios";
import {AuthRequest, AuthResponse} from "@/type/types.ts";
import {api} from "@/utils/axiosConfig.ts";

export const login = (user: AuthRequest): Promise<AuthResponse> => {
    return api.post("/auth/login", user)
        .then((res: AxiosResponse<AuthResponse>) => res.data);
};
