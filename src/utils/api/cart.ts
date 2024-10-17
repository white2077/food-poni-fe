import generateQueryString, { QueryParams } from "./common";
import { AxiosResponse } from "axios";
import { Cart, Page } from "@/type/types.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";

export const getCartsPage = (
  queryParams: QueryParams,
): Promise<Page<Cart[]>> => {
  return apiWithToken()
    .get(generateQueryString("/carts", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Cart[]>>) => res.data);
};

export const createCart = (
  quantity: number,
  id: string,
  toppings: Array<{ name: string; price: number }>,
  type: string | null,
): Promise<{ id: string }> => {
  return apiWithToken()
    .post(
      "/carts",
      { quantity, productDetail: { id }, toppings, type },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      },
    )
    .then((res: AxiosResponse<string>) => {
      return { id: res.data };
    });
};

export const updateCartQuantity = (
  id: string,
  quantity: number,
): Promise<void> => {
  return apiWithToken().patch(
    "/carts/update-quantity",
    { id, quantity },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );
};

export const updateCartChecked = ({
  id,
  checked,
}: {
  id: string;
  checked: boolean;
}): Promise<void> => {
  return apiWithToken().patch(
    "/carts/update-checked",
    { id, checked },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );
};

export const updateCartAllChecked = (): Promise<void> => {
  return apiWithToken().patch(
    "/carts/update-all-checked",
    {},
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );
};

export const deleteCart = (id: string): Promise<void> => {
  return apiWithToken().delete(`/carts/${id}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const deleteAllCart = (): Promise<void> => {
  return apiWithToken().delete("/carts/delete-all", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};
