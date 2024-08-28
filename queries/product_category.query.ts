import {Page} from "../models/Page";
import {api} from "../utils/axios-config";
import {AxiosError, AxiosResponse} from "axios";
import {ProductCategoryAPIResponse} from "../models/product_category/ProductCategoryAPIResponse";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";
import {QueryParams} from "./type";
import generateQueryString from "./common";

export const getCategoriesPage = (queryParams: QueryParams): Promise<Page<ProductCategoryAPIResponse[]>> => {
    return api.get(generateQueryString("/product-categories", queryParams))
        .then((res: AxiosResponse<Page<ProductCategoryAPIResponse[]>>) => res.data)
        .catch((res: AxiosError<ErrorAPIResponse>) => {
            throw res;
        });
}