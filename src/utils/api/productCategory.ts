import { ProductCategoriesFormState } from "@/components/molecules/ProductCategoriesForm";
import { Page, ProductCategory } from "@/type/types.ts";
import generateQueryString, { QueryParams } from "@/utils/api/common.ts";
import { accessToken, api, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";

export const getProductCategoriesPage = (
  queryParams?: QueryParams
): Promise<Page<ProductCategory[]>> => {
  return api
    .get(generateQueryString("/product-categories", queryParams))
    .then((res: AxiosResponse<Page<ProductCategory[]>>) => res.data);
};

export const checkProductCategoriesSlugIsExisted = (
  queryParams: QueryParams
): Promise<boolean> => {
  return apiWithToken()
    .get(
      generateQueryString(
        "retailer/product-categories/is-existed-by-slug",
        queryParams
      ),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<boolean>) => res.data);
};

export const createProductCategories = (
  productCategories: ProductCategoriesFormState
): Promise<void> => {
  return apiWithToken()
    .post("/product-categories", productCategories, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const updateProductCategories = (
  productCategories: ProductCategoriesFormState
): Promise<void> => {
  return apiWithToken()
    .put(`/product-categories/update-info`, productCategories, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const deleteProductCategories = (pcid: string): Promise<void> => {
  return apiWithToken()
    .delete(`/product-categories/delete/${pcid}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};
