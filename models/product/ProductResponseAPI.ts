import {UserResponseDTO} from "../user/UserResponseAPI";
import {CategoryResponseDTO} from "../category/CategoryResponseAPI";
import {ProductDetailResponseDTO} from "../product_detail/ProductDetailResponseAPI";

export interface ProductResponseDTO {

    id?: string;

    name?: string;

    slug?: string;

    shortDescription?: string;

    thumbnail?: string;

    status?: boolean;

    user?: UserResponseDTO;

    productDetails?: ProductDetailResponseDTO[];

    categories?: CategoryResponseDTO[];

    rate?: number;

    rateCount?: number;

}