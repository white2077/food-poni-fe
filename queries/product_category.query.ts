import {Page} from "../models/Page";
import {api} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {ProductCategoryAPIResponse} from "../models/product_category/ProductCategoryAPIResponse";

export const getCategoriesPage = ({page, pageSize}: {
    page?: number,
    pageSize?: number
}): Promise<Page<ProductCategoryAPIResponse[]>> => {
    return api.get(`/product-categories?page=${page ?? ''}&size=${pageSize ?? ''}&onlyParent=true`)
        .then((res: AxiosResponse<Page<ProductCategoryAPIResponse[]>>) => res.data);
}