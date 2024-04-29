import {ProductDetailResponseDTO} from "../product_detail/ProductDetailResponseAPI";
import {RateDTO} from "../order/OrderRequest";

export interface RateResponseDTO {

    rate: number;

    message: string;

    images: string[];

}