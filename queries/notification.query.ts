import {CookieValueTypes} from "cookies-next";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {NotificationAPIResponse} from "../models/notification/NotificationResponseAPI";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AxiosResponse} from "axios";

export const getNotificationsPageByCustomer = ({refreshToken, page, pageSize}: {
    refreshToken?: CookieValueTypes,
    page?: number,
    pageSize?: number
}): Promise<Page<NotificationAPIResponse[]>> => {
    if (refreshToken) {
        return apiWithToken(refreshToken).get(`/notifications?page=${page ?? ''}&size=${pageSize ?? ''}`, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
            .then((res: AxiosResponse<Page<NotificationAPIResponse[]>>) => res.data);
    }
    return Promise.resolve(INITIAL_PAGE_API_RESPONSE);
}