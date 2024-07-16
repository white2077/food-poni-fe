import {AxiosResponse} from "axios";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {OrderAPIResponse} from "../models/order/OrderAPIResponse";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {getAllType} from "./type";

export const getOrdersPage = ({refreshToken, page, pageSize, status}: getAllType): Promise<Page<OrderAPIResponse[]>> => {
    if (refreshToken) {
        return apiWithToken(refreshToken)
            .get(`/customer/orders?page=${page ?? ''}&pageSize=${pageSize ?? ''}&status=${status ?? ''}`, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then((res: AxiosResponse<Page<OrderAPIResponse[]>>) => res.data);
    }
    return Promise.resolve(INITIAL_PAGE_API_RESPONSE);
}