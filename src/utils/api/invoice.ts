import { Invoice, Page } from "@/type/types";
import { AxiosResponse } from "axios";
import { accessToken, apiWithToken } from "../axiosConfig";
import generateQueryString, { QueryParams } from "./common";

export const getConsolidatedInvoices = (
  queryParams: QueryParams
): Promise<Page<Invoice[]>> => {
  return apiWithToken()
    .get(generateQueryString("/postpaid-orders", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Invoice[]>>) => res.data);
};

export const createPostPaidOrders = (ppid: string): Promise<string> => {
  return apiWithToken()
    .post(
      `/postpaid-order/vnpay/${ppid}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};
