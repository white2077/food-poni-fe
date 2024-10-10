import { AxiosResponse } from "axios";
import { Page, ProductDetail } from "@/type/types.ts";
import { api } from "@/utils/axiosConfig.ts";

export const getProductDetailsByProductId = (
  pid: string,
): Promise<Page<ProductDetail[]>> => {
  return api
    .get(`/product-details/products/${pid}`)
    .then((res: AxiosResponse<Page<ProductDetail[]>>) => res.data);
};
