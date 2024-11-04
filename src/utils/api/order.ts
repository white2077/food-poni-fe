import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { Order, Page } from "@/type/types.ts";
import { OrderState } from "@/redux/modules/order";
import { server } from "@/utils/server.ts";

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
}: OrderState["form"]): Promise<string> => {
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

export const createVNPayOrder = (
  orderId: string,
  totalAmount: number,
  roomId?: string
): Promise<string> => {
  return apiWithToken()
    .get("/vn-pay", {
      params: {
        amount: totalAmount,
        bankCode: "NCB",
        vnp_OrderInfo: orderId,
        roomId,
        vnp_ReturnUrl: `${server}/api/v1/vn-pay/ipn`,
      },
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<string>) => res.data);
};

export const createOrderPostPaid = ({
  orderItems,
  shippingAddress,
  payment,
}: OrderState["form"]): Promise<string> => {
  return apiWithToken()
    .post(
      "/orders/post-paid",
      { orderItems, shippingAddress, payment },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};
