import {AxiosResponse} from "axios";
import {QueryParams} from "./type";
import generateQueryString from "./common";
import {ProductCategory} from "@/type/types.ts";
import {Page} from "@/models/Page.ts";
import {api} from "@/utils/axiosConfig.ts";

export const getProductCategoriesPage = (queryParams: QueryParams): Promise<Page<ProductCategory[]>> => {
    return api.get(generateQueryString("/product-categories", queryParams))
        .then((res: AxiosResponse<Page<ProductCategory[]>>) => res.data);
}