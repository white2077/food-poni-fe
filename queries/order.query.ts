import {AxiosResponse} from "axios";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {OrderAPIResponse} from "../models/order/OrderAPIResponse";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {QueryPageType} from "./type";

export const getOrdersPage = ({refreshToken, page, pageSize, status, sort}: QueryPageType): Promise<Page<OrderAPIResponse[]>> => {
    if (refreshToken) {
        return apiWithToken(refreshToken)
            .get(`/customer/orders?page=${page ?? ''}&size=${pageSize ?? ''}&status=${status ?? ''}&sort=${sort ?? ''}`, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then((res: AxiosResponse<Page<OrderAPIResponse[]>>) => res.data);
    }
    return Promise.resolve(INITIAL_PAGE_API_RESPONSE);
}