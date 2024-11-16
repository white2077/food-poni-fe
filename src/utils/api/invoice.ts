import { Invoice, Page } from "@/type/types";
import generateQueryString, { QueryParams } from "./common";
import { accessToken, apiWithToken } from "../axiosConfig";
import { AxiosResponse } from "axios";

export const getConsolidatedInvoices = (
  queryParams: QueryParams,
): Promise<Page<Invoice[]>> => {
  return apiWithToken()
    .get(generateQueryString("/postpaid-orders", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Invoice[]>>) => res.data);
};