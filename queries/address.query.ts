import {Page} from "../models/Page";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";
import {QueryParams} from "./type";
import generateQueryString from "./common";

export const getAddressesPage = (queryParams: QueryParams): Promise<Page<AddressAPIResponse[]>> => {
    if (queryParams.refreshToken) {
        return apiWithToken(queryParams.refreshToken)
            .get(generateQueryString("/addresses", queryParams), {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })
            .then((res: AxiosResponse<Page<AddressAPIResponse[]>>) => res.data)
            .catch((res: AxiosResponse<ErrorAPIResponse>) => {
                throw res;
            });
    }
    return Promise.reject();
}

export const getAddressById = (aid: string, queryParams: QueryParams): Promise<AddressAPIResponse> => {
    if (queryParams.refreshToken) {
        return apiWithToken(queryParams.refreshToken)
            .get(generateQueryString(`/addresses/${aid}`, queryParams), {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })
            .then((res: AxiosResponse<AddressAPIResponse>) => res.data)
            .catch((res: AxiosResponse<ErrorAPIResponse>) => {
                throw res;
            });
    }
    return Promise.reject();
}