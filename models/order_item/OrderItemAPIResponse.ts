import {ProductDetailAPIResponse} from "../product_detail/ProductDetailAPIResponse";
import {RateAPIResponse} from "../rate/RateAPIResponse";

export interface OrderItemAPIResponse {

    id: string;

    quantity: number;

    price: number;

    productDetail: ProductDetailAPIResponse;

    note: string;

    rate: RateAPIResponse;

}