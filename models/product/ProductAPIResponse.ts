import {INITIAL_USER_API_RESPONSE, UserAPIResponse} from "../user/UserResponseAPI";
import {CategoryAPIResponse} from "../category/CategoryAPIResponse";
import {ProductDetailAPIResponse} from "../product_detail/ProductDetailAPIResponse";
import {IProductDetail} from "../../pages/[pid]";

export interface ProductAPIResponse {

    id: string;

    name: string;

    slug: string;

    shortDescription: string;

    thumbnail: string;

    status: boolean;

    user: UserAPIResponse;

    sales: number;

    rate: number;

    rateCount: number;

    minPrice: number;

    maxPrice: number;

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

    sales: 0,

    rate: 0,

    rateCount: 0,

    minPrice: 0,

    maxPrice: 0,

    createdDate: new Date()

}