import {AxiosResponse} from "axios";
import {AuthAPIResponse} from "@/models/auth/AuthAPIResponse.ts";
import {AuthRequest} from "@/type/types.ts";
import {api} from "@/utils/axiosConfig.ts";

export const login = (user: AuthRequest): Promise<AuthAPIResponse> => {
    return api.post("/auth/login", user)
        .then((res: AxiosResponse<AuthAPIResponse>) => res.data);
};
