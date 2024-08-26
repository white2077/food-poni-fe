import {api, apiWithToken} from "../utils/axios-config";
import {Page} from "../models/Page";
import {ProductAPIResponse} from "../models/product/ProductAPIResponse";
import {AxiosResponse} from "axios";
import {IProductCard} from "../components/product-rows";
import {QueryParams} from "./type";
import generateQueryString from "./common";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";

export const getProductsPage = ({page, pageSize, status, categoryId}: {
    page?: number,
    pageSize?: number,
    status?: boolean,
    categoryId?: string
}): Promise<Page<ProductAPIResponse[]>> => {
    return api.get(`/products?page=${page ?? ''}&size=${pageSize ?? ''}&status=${status ?? ''}&categoryId=${categoryId ?? ''}`)
        .then((res: AxiosResponse<Page<ProductAPIResponse[]>>) => res.data);
}

export const getProductsPageByRetailer = ({rid, page, pageSize, status}: {
    rid: string,
    page?: number,
    pageSize?: number,
    status?: boolean
}): Promise<Page<ProductAPIResponse[]>> => {
    return api.get(`/products/retailer/${rid}?page=${page ?? ''}&pageSize=${pageSize ?? ''}&status=${status ?? ''}`)
        .then((res: AxiosResponse<Page<ProductAPIResponse[]>>) => res.data);
}

export const getProductsCardPage = (queryParams: QueryParams): Promise<Page<IProductCard[]>> => {
    return api.get(generateQueryString("/products", queryParams))
        .then((res: AxiosResponse<Page<ProductAPIResponse[]>>) => {
            return {
                content: res.data.content.filter(product => product.minPrice != null).map((product, index) => {
                    return {
                        index,
                        id: product.id,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        minPrice: product.minPrice,
                        maxPrice: product.maxPrice,
                        rate: product.rate,
                        retailer: product.user.username,
                        rateCount: product.rateCount,
                        sales: product.sales,
                        createdDate: product.createdDate,
                    } as IProductCard
                }),
                empty: res.data.empty,
                first: res.data.first,
                last: res.data.last,
                number: res.data.number,
                numberOfElements: res.data.numberOfElements,
                size: res.data.size,
                totalElements: res.data.totalElements,
                totalPages: res.data.totalPages
            } as Page<IProductCard[]>;
        }).catch((res: AxiosResponse<ErrorAPIResponse>) => {
            throw res;
        });
}