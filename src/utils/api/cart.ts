import {QueryParams} from "./type";
import {Page} from "../models/Page";
import {accessToken, apiWithToken} from "../utils/axios-config";
import generateQueryString from "./common";
import {AxiosResponse} from "axios";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";
import {CartAPIResponse} from "../models/cart/CartAPIResponse";

export const getCartsPage = (queryParams: QueryParams): Promise<Page<CartAPIResponse[]>> => {
    if (queryParams.refreshToken) {
        return apiWithToken(queryParams.refreshToken)
            .get(generateQueryString("/carts", queryParams), {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })
            .then((res: AxiosResponse<Page<CartAPIResponse[]>>) => res.data)
            .catch((res: AxiosResponse<ErrorAPIResponse>) => {
                throw res;
            });
    }
    return Promise.reject();
}