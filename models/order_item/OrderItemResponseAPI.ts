import {ProductDetailResponseDTO} from "../product_detail/ProductDetailResponseAPI";

export interface OrderItemResponseDTO {

    id?: string;

    quantity?: number;

    price?: number;

    productDetail?: ProductDetailResponseDTO;

    note?: string;

}