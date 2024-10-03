import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { Page, Order } from "@/type/types.ts";

export const getOrdersPage = (queryParams: QueryParams): Promise<Page<Order[]>> => {
    return apiWithToken().get(generateQueryString("/customer/orders", queryParams), {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }).then((res: AxiosResponse<Page<Order[]>>) => res.data);
}

export const getOrderById = (oid: string, queryParams: QueryParams): Promise<Order> => {
    return apiWithToken().get(generateQueryString(`/customer/orders/${oid}`, queryParams), {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }).then((res: AxiosResponse<Order>) => res.data);
}

export const getOrdersPageByStatus = (status: string, queryParams: QueryParams): Promise<Page<Order[]>> => {
    return apiWithToken().get(generateQueryString(`/customer/orders/status/${status}`, queryParams), {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }).then((res: AxiosResponse<Page<Order[]>>) => res.data);
}

export const createOrder = (orderData: any): Promise<Order> => {
    return apiWithToken().post("/customer/orders", orderData)
        .then((res: AxiosResponse<Order>) => res.data);
}