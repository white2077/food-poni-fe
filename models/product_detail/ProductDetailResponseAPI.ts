import {INITIAL_PRODUCT_API_RESPONSE, ProductResponseDTO} from "../product/ProductResponseAPI";
import {OrderItemResponseDTO} from "../order_item/OrderItemResponseAPI";

export interface ProductDetailResponseDTO {

    id: string;

    name: string;

    price: number;

    description: string;

    status: boolean;

    images: string[];

    product: ProductResponseDTO;

    orderItems: OrderItemResponseDTO[];

}

export const INITIAL_PRODUCT_DETAIL_RESPONSE_DTO: ProductDetailResponseDTO = {

    id: '',

    name: '',

    price: 0,

    description: '',

    status: false,

    images: [],

    product: INITIAL_PRODUCT_API_RESPONSE,

    orderItems: []

}