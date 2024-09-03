import {UserAPIResponse} from "../user/UserAPIResponse";
import {ProductDetailAPIResponse} from "../product_detail/ProductDetailAPIResponse";

export interface CartAPIResponse {

    id: string;

    user: UserAPIResponse;

    retailer: UserAPIResponse;

    quantity: number;

    productName: string;

    productDetail: ProductDetailAPIResponse;

    checked: boolean;

}