import {INITIAL_USER_API_RESPONSE, UserAPIResponse} from "../user/UserResponseAPI";
import {CategoryAPIResponse} from "../category/CategoryAPIResponse";
import {ProductDetailAPIResponse} from "../product_detail/ProductDetailAPIResponse";

export interface ProductAPIResponse {

    id: string;

    name: string;

    slug: string;

    shortDescription: string;

    thumbnail: string;

    status: boolean;

    user: UserAPIResponse;

    productDetails: ProductDetailAPIResponse[];

    categories: CategoryAPIResponse[];

    createdDate: Date;

}

export const INITIAL_PRODUCT_API_RESPONSE: ProductAPIResponse = {

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