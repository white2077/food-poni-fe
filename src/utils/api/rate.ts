import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { Page, Rate } from "@/type/types";
import { accessToken, apiWithToken } from "@/utils/axiosConfig";

export const getRatesByProductId = (
  productId: string,
  queryParams: QueryParams
): Promise<Page<Rate[]>> => {
  return apiWithToken()
    .get(generateQueryString(`/product-details/rate/${productId}`, queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Rate[]>>) => res.data);
};

export const createRate = (
  orderItemId: string,
  rateRequest: Rate
): Promise<void> => {
  return apiWithToken().post(
    `/order-items/rate/${orderItemId}`,
    rateRequest,
    {
      headers: {
        Authorization: "Bearer " + accessToken
      },
    }
  );
};
