import {
    INITIAL_PRODUCT_DETAIL_RESPONSE_DTO,
    ProductDetailResponseDTO
} from "../product_detail/ProductDetailResponseAPI";
import {INITIAL_RATE_API_RESPONSE, RateResponseDTO} from "../rate/RateResponseAPI";

export interface OrderItemResponseDTO {

    id: string;

    quantity: number;

    price: number;

    productDetail: ProductDetailResponseDTO;

    note: string;

    rate: RateResponseDTO;

}

export const INITIAL_ORDER_ITEM_API_RESPONSE: OrderItemResponseDTO = {

    id: '',

    quantity: 0,

    price: 0,

    productDetail: INITIAL_PRODUCT_DETAIL_RESPONSE_DTO,

    note: '',

    rate: INITIAL_RATE_API_RESPONSE

}