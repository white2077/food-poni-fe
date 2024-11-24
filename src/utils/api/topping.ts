import { ToppingFormState } from "@/components/molecules/ToppingForm";
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

export const createTopping = (topping: ToppingFormState): Promise<void> => {
  return apiWithToken()
    .post("/toppings", topping, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const updateTopping = (topping: ToppingFormState): Promise<void> => {
  return apiWithToken()
    .put(`/toppings/update-info`, topping, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const deleteTopping = (tid: string): Promise<void> => {
  return apiWithToken()
    .delete(`/toppings/${tid}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

