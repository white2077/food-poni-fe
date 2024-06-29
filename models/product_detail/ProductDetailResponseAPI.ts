import {INITIAL_PRODUCT_API_RESPONSE, ProductResponseDTO} from "../product/ProductResponseAPI";

export interface ProductDetailResponseDTO {

    id: string;

    name: string;

    price: number;

    description: string;

    status: boolean;

    images: string[];

    product: ProductResponseDTO;

    rate: number;

    sales: number;

    rateCount: number;

}

export const INITIAL_PRODUCT_DETAIL_RESPONSE_DTO: ProductDetailResponseDTO = {

    id: '',

    name: '',

    price: 0,

    description: '',

    status: false,

    images: [],

    product: INITIAL_PRODUCT_API_RESPONSE,

    rate: 0,

    sales: 0,

    rateCount: 0

}