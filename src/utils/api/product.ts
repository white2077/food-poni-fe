import {AxiosResponse} from "axios";
import generateQueryString, {QueryParams} from "./common";
import {api} from "@/utils/axiosConfig.ts";
import {Page, Product} from "@/type/types.ts";

export const getProductsPageByRetailer = (rid: string, queryParams: QueryParams): Promise<Page<Product[]>> => {
    return api.get(generateQueryString(`/products/retailer/${rid}`, queryParams))
        .then((res: AxiosResponse<Page<Product[]>>) => res.data);
}

export const getProductsPage = (queryParams: QueryParams): Promise<Page<Product[]>> => {
    return api.get(generateQueryString("/products", queryParams))
        .then((res: AxiosResponse<Page<Product[]>>) => res.data);
}

export const getProductsPageByCategory = (cid: string, queryParams: QueryParams): Promise<Page<Product[]>> => {
    return api.get(generateQueryString(`/products/product-categories/${cid}`, queryParams))
        .then((res: AxiosResponse<Page<Product[]>>) => res.data);
}

export const getProductByIdOrSlug = (pid: string): Promise<Product> => {
    return api.get(`/products/${pid}`)
        .then((res: AxiosResponse<Product>) => res.data);
}