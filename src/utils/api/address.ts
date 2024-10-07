import {AxiosResponse} from "axios";
import generateQueryString, {QueryParams} from "./common";
import {Address, Page} from "@/type/types.ts";
import {accessToken, apiWithToken} from "@/utils/axiosConfig.ts";

export const getAddressesPage = (queryParams: QueryParams): Promise<Page<Address[]>> => {
    return apiWithToken()
        .get(generateQueryString("/addresses", queryParams), {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
        .then((res: AxiosResponse<Page<Address[]>>) => res.data);
}

export const getAddressById = (aid: string, queryParams: QueryParams): Promise<Address> => {
    return apiWithToken()
        .get(generateQueryString(`/addresses/${aid}`, queryParams), {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
        .then((res: AxiosResponse<Address>) => res.data);
}

export const createAddress = ({fullName, phoneNumber, address, lon, lat}: {
    fullName: string,
    phoneNumber: string,
    address: string,
    lon: number,
    lat: number
}): Promise<void> => {
    return apiWithToken()
        .post("/addresses", {fullName, phoneNumber, address, lon, lat}, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
}

export const deleteAddressById = (aid: string): Promise<void> => {
    return apiWithToken()
        .delete(`/addresses/${aid}`, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
}