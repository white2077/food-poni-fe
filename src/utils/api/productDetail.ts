import {api} from "../utils/axios-config";
import {AxiosError, AxiosResponse} from "axios";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";
import {Page} from "../models/Page";
import {ProductDetailAPIResponse} from "../models/product_detail/ProductDetailAPIResponse";

export const getProductDetailsByProductId = (pid: string): Promise<Page<ProductDetailAPIResponse[]>> => {
    return api.get(`/product-details/products/${pid}`)
        .then((res: AxiosResponse<Page<ProductDetailAPIResponse[]>>) => res.data)
        .catch((res: AxiosError<ErrorAPIResponse>) => {
            throw res;
        });
}