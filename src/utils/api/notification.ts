import { Page } from "../models/Page";
import { NotificationAPIResponse } from "../models/notification/NotificationAPIResponse";
import { accessToken, apiWithToken } from "../utils/axios-config";
import { AxiosResponse } from "axios";
import { QueryParams } from "./type";
import generateQueryString from "./common";
import { ErrorAPIResponse } from "../models/ErrorAPIResponse";

export const getNotificationsPageByCustomer = (
  queryParams: QueryParams,
): Promise<Page<NotificationAPIResponse[]>> => {
  return apiWithToken()
    .get(generateQueryString("/notifications", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<NotificationAPIResponse[]>>) => res.data)
    .catch((res: AxiosResponse<ErrorAPIResponse>) => {
      throw res;
    });
};
