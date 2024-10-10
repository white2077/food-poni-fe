import { api } from "../utils/axios-config";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorAPIResponse } from "../models/ErrorAPIResponse";
import { UserAPIResponse } from "../models/user/UserAPIResponse";

export const getUserById = (uid: string): Promise<UserAPIResponse> => {
  return api
    .get(`/users/${uid}`)
    .then((res: AxiosResponse<UserAPIResponse>) => res.data)
    .catch((res: AxiosError<ErrorAPIResponse>) => {
      throw res;
    });
};
