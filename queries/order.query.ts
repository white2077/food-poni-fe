import {AxiosResponse} from "axios";
import {Page} from "../models/Page";
import {OrderAPIResponse} from "../models/order/OrderAPIResponse";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {QueryParams} from "./type";
import generateQueryString from "./common";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";
import {IOrder, IOrderItem} from "../pages/don-hang/[oid]";
import {UserAPIResponse} from "../models/user/UserAPIResponse";

export const getOrdersPage = (queryParams: QueryParams): Promise<Page<OrderAPIResponse[]>> => {
    if (queryParams.refreshToken) {
        return apiWithToken(queryParams.refreshToken)
            .get(generateQueryString("/customer/orders", queryParams), {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })
            .then((res: AxiosResponse<Page<OrderAPIResponse[]>>) => res.data)
            .catch((res: AxiosResponse<ErrorAPIResponse>) => {
                throw res;
            });
    }
    return Promise.reject();
}

export const getOrderById = (oid: string, queryParams: QueryParams): Promise<IOrder> => {
    if (queryParams.refreshToken) {
        return apiWithToken(queryParams.refreshToken)
            .get(generateQueryString(`/customer/orders/${oid}`, queryParams), {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })
            .then((res: AxiosResponse<OrderAPIResponse>) => {
                return {
                    id: res.data.id ?? "",
                    totalAmount: res.data.totalAmount ?? 0,
                    status: res.data.status ?? "",
                    user: res.data.user ?? {} as UserAPIResponse,
                    shippingAddress: res.data.shippingAddress ?? {},
                    paymentMethod: res.data.payment ?? {},
                    orderItems: res.data.orderItems?.map((orderItem): IOrderItem => {
                    return {
                        id: orderItem.id ?? "",
                        name: orderItem.productDetail?.product?.name ?? "",
                        quantity: orderItem.quantity ?? 0,
                        price: orderItem.price ?? 0,
                        image: orderItem.productDetail?.product?.thumbnail ?? "",
                        rate: orderItem.rate ?? {},
                        productDetail: {
                            id: orderItem.productDetail?.id ?? "",
                            name: orderItem.productDetail?.name ?? "",
                            price: orderItem.productDetail?.price ?? 0
                        },
                        retailerId: orderItem.productDetail?.product?.user?.id ?? "",
                    }
                }) ?? [],
                    shippingFee: res.data.shippingFee ?? 0,
                    retailer: res.data.retailer ?? {} as UserAPIResponse,
                    createdDate: res.data.createdDate ?? new Date(),
                }
            })
            .catch((res: AxiosResponse<ErrorAPIResponse>) => {
                throw res;
            });
    }
    return Promise.reject();
}