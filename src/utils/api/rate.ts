import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { apiWithToken } from "@/utils/axiosConfig";
import { Page, Rate } from "@/type/types";

export const getRatesByProductId = (productId: string, queryParams: QueryParams, accessToken: string): Promise<Page<Rate[]>> => {
    return apiWithToken().get(generateQueryString(`/product-details/rate/${productId}`, queryParams), {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })
        .then((res: AxiosResponse<Page<Rate[]>>) => res.data);
}