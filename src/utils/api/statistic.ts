import {
  Page,
  Product,
  ProductCategory,
  ProductDetail,
  StatisticReviews,
  StatisticStatus,
} from "@/type/types";
import { AxiosResponse } from "axios";
import { accessToken, apiWithToken } from "../axiosConfig";
import generateQueryString, { QueryParams } from "./common";

export const getStatisticStatus = (
  queryParams?: QueryParams
): Promise<Page<StatisticStatus>> => {
  return apiWithToken()
    .get(generateQueryString("/statistics/order-status", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<StatisticStatus>>) => res.data);
};

export const getStatisticPopularProduct = (
  queryParams?: QueryParams
): Promise<Page<Product[]>> => {
  return apiWithToken()
    .get(generateQueryString("/statistics/popular-products", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Product[]>>) => res.data);
};

export const getStatisticSalesOverall = (
  queryParams?: QueryParams
): Promise<void> => {
  return apiWithToken()
    .get(generateQueryString("/statistics/sales/overall", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const getStatisticProductsCategories = (): Promise<
  Page<ProductCategory[]>
> => {
  return apiWithToken()
    .get("statistics/products/categories", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<ProductCategory[]>>) => res.data);
};
export const getStatisticReviews = (): Promise<Page<StatisticReviews>> => {
  return apiWithToken()
    .get("statistics/reviews", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<StatisticReviews>>) => res.data);
};

export const getStatisticPopularCategories = (): Promise<
  Page<ProductCategory[]>
> => {
  return apiWithToken()
    .get("/statistics/popular-categories", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<ProductCategory[]>>) => res.data);
};

export const getStatisticSalesTotal = (
  queryParams?: QueryParams
): Promise<number> => {
  return apiWithToken()
    .get(generateQueryString("/statistics/sales/total-all", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<number>) => res.data);
};

export const getStatisticSalesPostpaid = (
  queryParams?: QueryParams
): Promise<number> => {
  return apiWithToken()
    .get(generateQueryString("/statistics/postpaid-order-count", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<number>) => res.data);
};

export const getStatisticSalesTotalUser = (): Promise<number> => {
  return apiWithToken()
    .get("/statistics/total-user", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<number>) => res.data);
};

export const getStatisticPopularProductDetailer = (): Promise<
  Page<ProductDetail[]>
> => {
  return apiWithToken()
    .get("/statistics/popular-products-detail", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<ProductDetail[]>>) => res.data);
};

export const getStatisticSalesTotalOrder = (
  queryParams: QueryParams
): Promise<number> => {
  return apiWithToken()
    .get(generateQueryString("/statistics/total-orders", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<number>) => res.data);
};
