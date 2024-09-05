import {UserIdDTO} from "../user/UserRequest";
import {ProductDetailIdDTO} from "../product_detail/ProductDetailRequest";

export interface CartCreationRequestDTO {

    user: UserIdDTO;

    retailer: UserIdDTO;

    quantity: number;

    productDetail: ProductDetailIdDTO;

    checked: boolean;

}