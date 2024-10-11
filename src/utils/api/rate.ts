import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { api } from "@/utils/axiosConfig";
import { Page, Rate } from "@/type/types";

export const getRatesByProductId = (
  productId: string,
  queryParams: QueryParams,
): Promise<Page<Rate[]>> => {
  return api
    .get(generateQueryString(`/product-details/rate/${productId}`, queryParams))
    .then((res: AxiosResponse<Page<Rate[]>>) => res.data);
};
