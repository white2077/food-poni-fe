import {INITIAL_PRODUCT_API_RESPONSE, ProductAPIResponse} from "../product/ProductAPIResponse";

export interface ProductDetailAPIResponse {

    id: string;

    name: string;

    price: number;

    description: string;

    sales: number;

    rate: number;

    rateCount: number;

    status: boolean;

    images: string[];

    product: ProductAPIResponse;

}

export const INITIAL_PRODUCT_DETAIL_API_RESPONSE: ProductDetailAPIResponse = {

    id: '',

    name: '',

    price: 0,

    description: '',

    sales: 0,

    rate: 0,

    rateCount: 0,

    status: false,

    images: [],

    product: INITIAL_PRODUCT_API_RESPONSE

}