import { AxiosResponse } from "axios";
import { Page, ProductDetail, ProductRatePercent } from "@/type/types.ts";
import { accessToken, api, apiWithToken } from "@/utils/axiosConfig.ts";
import { ProductDetailFormState } from "@/components/molecules/ProductDetailForm";
import generateQueryString, { QueryParams } from "./common";

export const getProductDetailsByProductId = (
  pid: string,
  queryParams?: QueryParams
): Promise<Page<ProductDetail[]>> => {
  return api
    .get(generateQueryString(`/product-details/products/${pid}`, queryParams))
    .then((res: AxiosResponse<Page<ProductDetail[]>>) => res.data);
};

export const getProductRatePercent = (
  pdid: string
): Promise<ProductRatePercent[]> => {
  return api
    .get(`/product-details/rate-percent/${pdid}`)
    .then((res: AxiosResponse<ProductRatePercent[]>) => res.data);
};

export const createProductDetail = (
  productDetails: ProductDetailFormState
): Promise<void> => {
  return apiWithToken()
    .post("/product-details", productDetails, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const updateProductDetail = (
  productDetails: ProductDetailFormState
): Promise<void> => {
  return apiWithToken()
    .put(`/product-details/update-info`, productDetails, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const deleteProductDetail = (pid: string): Promise<void> => {
  return apiWithToken()
    .delete(`/retailer/product-details/${pid}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const updateProductDetailStatus = (pdid: string, status: boolean): Promise<void> => {
  return apiWithToken()
    .patch("/product-details/update-status", {id: pdid, status}, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};
