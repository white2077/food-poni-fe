import { OrderRequest } from "@/components/pages/CheckoutPage.tsx";
import { Order, Page } from "@/type/types.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";

export const getOrdersPageByCustomer = (
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

export const getOrdersPageByRetailer = (
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(generateQueryString("/retailer/orders", queryParams), {
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

export const createOrder = (values: OrderRequest): Promise<string> => {
  return apiWithToken()
    .post("/orders", values, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<string>) => res.data);
};

export const createVNPayOrder = (
  addressId: string,
  note: string
): Promise<string> => {
  return apiWithToken()
    .post(
      "/orders/vnpay",
      { addressId, note },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};

export const createOrderPostPaid = (values: OrderRequest): Promise<string> => {
  return apiWithToken()
    .post("/orders/post-paid", values, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<string>) => res.data);
};

export const calculateShippingFee = (addressId: string): Promise<number> => {
  return apiWithToken()
    .get(`/shipping-fee/${addressId}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<number>) => res.data);
};

export const updateStatus = (
  oid: string,
  orderStatus: string
): Promise<void> => {
  return apiWithToken()
    .patch(
      generateQueryString(`/retailer/orders/${oid}`, {
        orderStatus,
      }),
      {},
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<void>) => res.data);
};
