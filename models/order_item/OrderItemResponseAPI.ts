import {
    INITIAL_PRODUCT_DETAIL_API_RESPONSE,
    ProductDetailAPIResponse
} from "../product_detail/ProductDetailAPIResponse";
import {INITIAL_RATE_API_RESPONSE, RateAPIResponse} from "../rate/RateAPIResponse";

export interface OrderItemAPIResponse {

    id: string;

    quantity: number;

    price: number;

    productDetail: ProductDetailAPIResponse;

    note: string;

    rate: RateAPIResponse;

}

export const INITIAL_ORDER_ITEM_API_RESPONSE: OrderItemAPIResponse = {

    id: '',

    quantity: 0,

    price: 0,

    productDetail: INITIAL_PRODUCT_DETAIL_API_RESPONSE,

    note: '',

    rate: INITIAL_RATE_API_RESPONSE

}