import {ProductDetailResponseDTO} from "../product_detail/ProductDetailResponseAPI";
import {RateDTO} from "../order/OrderRequest";
import {RateResponseDTO} from "../rate/RateResponseAPI";

export interface OrderItemResponseDTO {

    id: string;

    quantity: number;

    price: number;

    productDetail: ProductDetailResponseDTO;

    note: string;

    rate: RateResponseDTO;

}