import { CartGroup } from "@/type/types.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";
import generateQueryString from "./common";

export const joinCartGroup = (roomId: string): Promise<CartGroup> => {
  return apiWithToken()
    .post(
      generateQueryString("/cart-group/join-room"),
      {
        roomId,
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<CartGroup>) => res.data);
};

export const getCartGroups = (): Promise<Array<CartGroup>> => {
  return apiWithToken()
    .get(generateQueryString("/cart-group/get-join-rooms"), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Array<CartGroup>>) => res.data);
};

export const addCartItem = (
  roomId: string,
  productDetail: { id: string },
  toppings: Array<{ id: string }>,
  type: string | null,
  quantity: number
): Promise<string> => {
  return apiWithToken()
    .post(
      generateQueryString("/cart-group/add-item"),
      {
        roomId,
        productDetail,
        toppings,
        type,
        quantity,
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};

export const updateCartItemQuantity = (
  id: string,
  quantity: number
): Promise<void> => {
  return apiWithToken().patch(
    "/cart-group/update-quantity",
    { id, quantity },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
};

export const deleteCartItem = (id: string): Promise<void> => {
  return apiWithToken().delete("/cart-group/" + id, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const createCartGroup = (timeout: string): Promise<CartGroup> => {
  return apiWithToken()
    .post(
      "/cart-group/create-room",
      { timeout },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<CartGroup>) => res.data);
};

export const deleteCartGroup = (roomId: string): Promise<string> => {
  return apiWithToken()
    .delete("/cart-group/remove-room/" + roomId, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<string>) => res.data);
};

export const leaveCartGroup = (
  roomId: string
): Promise<{ roomId: string; uid: string }> => {
  return apiWithToken()
    .delete("/cart-group/leave-room/" + roomId, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<string>) => ({
      roomId: roomId,
      uid: res.data,
    }));
};

export const kickUser = (roomId: string, userId: string): Promise<void> => {
  return apiWithToken().delete(generateQueryString("/cart-group/kick-user"), {
    data: { roomId, userId },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};
