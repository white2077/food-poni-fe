import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { Notification, Page } from "@/type/types.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";

export const getNotificationsPage = (
  queryParams: QueryParams,
): Promise<Page<Notification[]>> => {
  return apiWithToken()
    .get(generateQueryString("/notifications", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Notification[]>>) => res.data);
};

export const markIsReadNotification = (id: string): Promise<void> => {
  return apiWithToken().patch(
    "/notifications/update-read",
    {
      id,
      read: true,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );
};
