import {QueryParams} from "./type";
import {Page} from "../models/Page";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {accessToken, apiWithToken} from "../utils/axios-config";
import generateQueryString from "./common";
import {AxiosResponse} from "axios";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";
import {RateAPIResponse} from "../models/rate/RateAPIResponse";

export const getRateByCustomerAndOrderId = (oid: string, queryParams: QueryParams): Promise<Page<RateAPIResponse[]>> => {
    if (queryParams.refreshToken) {
        return apiWithToken(queryParams.refreshToken)
            .get(generateQueryString(`/customer/orders/rate/${oid}`, queryParams), {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })
            .then((res: AxiosResponse<Page<RateAPIResponse[]>>) => res.data)
            .catch((res: AxiosResponse<ErrorAPIResponse>) => {
                throw res;
            });
    }
    return Promise.reject();
}