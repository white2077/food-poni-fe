import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { Order, Page } from "@/type/types.ts";

export const getOrdersPage = (
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(generateQueryString("/customer/orders", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const getOrderById = (oid: string): Promise<Order> => {
  return apiWithToken()
    .get(generateQueryString(`/customer/orders/${oid}`), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Order>) => res.data);
};

export const getOrdersPageByStatus = (
  status: string,
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(
      generateQueryString(`/customer/orders/status/${status}`, queryParams),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const createOrder = ({
  orderItems,
  shippingAddress,
  payment,
}: {
  orderItems: {
    quantity: number;
    productDetail: {
      id: string;
    };
  }[];
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    address: string;
    lon: number;
    lat: number;
  };
  payment: {
    method: string;
    status: string;
  };
}): Promise<string> => {
  return apiWithToken()
    .post(
      "/orders",
      { orderItems, shippingAddress, payment },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};
