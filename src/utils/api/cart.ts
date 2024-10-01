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

export const createCart = ({quantity, productDetail}: { quantity: number, productDetail: string }): void => {
    apiWithToken()
        .post("/carts", {quantity, productDetail}, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
}

export const updateCartQuantity = ({pdid, quantity}: { pdid: string, quantity: number }): void => {
    apiWithToken()
        .patch("/carts/update-quantity", {pdid, quantity}, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
}

export const deleteCart = (pdid: string): void => {
    apiWithToken()
        .delete(`/carts/${pdid}`, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
}