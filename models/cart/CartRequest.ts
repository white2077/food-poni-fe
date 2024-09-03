import {UserAPIResponse} from "../user/UserAPIResponse";
import {ProductDetailAPIResponse} from "../product_detail/ProductDetailAPIResponse";

export interface CartCreationRequestDTO {

    user: UserAPIResponse;

    retailer: UserAPIResponse;

    quantity: number;

    productDetail: ProductDetailAPIResponse;

    checked: boolean;

}