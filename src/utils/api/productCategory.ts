import { AxiosResponse } from "axios";
import { Page, ProductCategory } from "@/type/types.ts";
import { api } from "@/utils/axiosConfig.ts";
import generateQueryString, { QueryParams } from "@/utils/api/common.ts";

export const getProductCategoriesPage = (
  queryParams: QueryParams,
): Promise<Page<ProductCategory[]>> => {
  return api
    .get(generateQueryString("/product-categories", queryParams))
    .then((res: AxiosResponse<Page<ProductCategory[]>>) => res.data);
};
