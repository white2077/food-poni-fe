import {INITIAL_PRODUCT_API_RESPONSE, ProductAPIResponse} from "../product/ProductAPIResponse";
import {OrderItemAPIResponse} from "../order_item/OrderItemResponseAPI";

export interface ProductDetailAPIResponse {

    id: string;

    name: string;

    price: number;

    description: string;

    status: boolean;

    images: string[];

    product: ProductAPIResponse;

    orderItems: OrderItemAPIResponse[];

}

export const INITIAL_PRODUCT_DETAIL_API_RESPONSE: ProductDetailAPIResponse = {

    id: '',

    name: '',

    price: 0,

    description: '',

    status: false,

    images: [],

    product: INITIAL_PRODUCT_API_RESPONSE,

    orderItems: []

}