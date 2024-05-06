import {ProductResponseDTO} from "../product/ProductResponseAPI";

export interface ProductDetailResponseDTO {

    id?: string;

    name?: string;

    price?: number;

    description?: string;

    status?: boolean;

    images?: string[];

    product?: ProductResponseDTO;

    rate?: number;

    sales?: number;

    rateCount?: number;

}