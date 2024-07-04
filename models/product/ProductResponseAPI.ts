import {INITIAL_USER_API_RESPONSE, UserResponseDTO} from "../user/UserResponseAPI";
import {CategoryResponseDTO} from "../category/CategoryResponseAPI";
import {ProductDetailResponseDTO} from "../product_detail/ProductDetailResponseAPI";

export interface ProductResponseDTO {

    id: string;

    name: string;

    slug: string;

    shortDescription: string;

    thumbnail: string;

    status: boolean;

    user: UserResponseDTO;

    productDetails: ProductDetailResponseDTO[];

    categories: CategoryResponseDTO[];

    createdDate: Date;

}

export const INITIAL_PRODUCT_API_RESPONSE: ProductResponseDTO = {

    id: "",

    name: "",

    slug: "",

    shortDescription: "",

    thumbnail: "",

    status: false,

    user: INITIAL_USER_API_RESPONSE,

    productDetails: [],

    categories: [],

    createdDate: new Date()

}