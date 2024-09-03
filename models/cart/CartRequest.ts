import {ProductDetailAPIResponse} from "../product_detail/ProductDetailAPIResponse";
import {UserIdDTO} from "../user/UserRequest";

export interface CartCreationRequestDTO {

    user: UserIdDTO;

    retailer: UserIdDTO;

    quantity: number;

    productDetail: ProductDetailAPIResponse;

    checked: boolean;

}