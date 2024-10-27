import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { Page, Rate } from "@/type/types";
import { accessToken, api, apiWithToken } from "@/utils/axiosConfig";

export const getRatesByProductId = (
  productId: string,
  queryParams: QueryParams,
): Promise<Page<Rate[]>> => {
  return api
    .get(generateQueryString(`/product-details/rate/${productId}`, queryParams))
    .then((res: AxiosResponse<Page<Rate[]>>) => res.data);
};

export const createRate = (
  orderItemId: string,
  rateRequest: Rate,
): Promise<void> => {
  return apiWithToken().post(`/order-items/rate/${orderItemId}`, rateRequest, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};
