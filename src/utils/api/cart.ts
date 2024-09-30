import generateQueryString, {QueryParams} from "./common";
import {AxiosResponse} from "axios";
import {Cart, Page} from "@/type/types.ts";
import {accessToken, apiWithToken} from "@/utils/axiosConfig.ts";

export const getCartsPage = (queryParams: QueryParams): Promise<Page<Cart[]>> => {
    return apiWithToken()
        .get(generateQueryString("/carts", queryParams), {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
        .then((res: AxiosResponse<Page<Cart[]>>) => res.data);
}

export const updateCartQuantity = ({id, quantity}: { id: string, quantity: number }): void => {
    apiWithToken()
        .patch("/carts/update-quantity", {id, quantity}, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
}

export const deleteCart = (id: string): void => {
    apiWithToken()
        .delete(`/carts/${id}`, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
}