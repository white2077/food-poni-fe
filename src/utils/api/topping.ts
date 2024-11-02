import { Page, ProductCategory } from "@/type/types.ts";
import generateQueryString, { QueryParams } from "@/utils/api/common.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";

export const getToppingsPage = (
  queryParams: QueryParams
): Promise<Page<ProductCategory[]>> => {
  return apiWithToken()
    .get(generateQueryString("/toppings", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<ProductCategory[]>>) => res.data);
};
