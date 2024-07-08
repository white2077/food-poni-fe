import {api} from "../utils/axios-config";
import {Page} from "../models/Page";
import {ProductAPIResponse} from "../models/product/ProductAPIResponse";
import {AxiosResponse} from "axios";


export const getProductsPage = ({page, pageSize, status, categoryId}: {
    page?: number,
    pageSize?: number,
    status?: boolean,
    categoryId?: string
}): Promise<Page<ProductAPIResponse[]>> => {
    return api.get(`/products?page=${page ?? ''}&${pageSize ?? ''}&status=${status ?? ''}&status=${categoryId ?? ''}`)
        .then((res: AxiosResponse<Page<ProductAPIResponse[]>>) => res.data);
}