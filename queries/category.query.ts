import {Page} from "../models/Page";
import {api} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {CategoryAPIResponse} from "../models/category/CategoryAPIResponse";

export const getCategoriesPage = ({page, pageSize}: {
    page?: number,
    pageSize?: number
}): Promise<Page<CategoryAPIResponse[]>> => {
    return api.get(`/categories?page=${page ?? ''}&size=${pageSize ?? ''}&onlyParent=true`)
        .then((res: AxiosResponse<Page<CategoryAPIResponse[]>>) => res.data);
}