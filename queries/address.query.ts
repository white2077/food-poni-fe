import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {CookieValueTypes} from "cookies-next";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";

export const getAddressesPage = ({refreshToken, page, pageSize}: {
    refreshToken?: CookieValueTypes,
    page?: number,
    pageSize?: number
}): Promise<Page<AddressAPIResponse[]>> => {
    if (refreshToken) {
        return apiWithToken(refreshToken)
            .get(`/addresses?page=${page ?? ''}&size=${pageSize ?? ''}`, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then((res: AxiosResponse<Page<AddressAPIResponse[]>>) => res.data)
            .catch((res: AxiosResponse<ErrorAPIResponse>) => {
                throw res;
            });
    }
    return Promise.reject();
}