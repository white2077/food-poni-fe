import {ICartItem} from "../../stores/cart.reducer";

export interface OrderItemRequestDTO {

    quantity: number;

    productDetail: ICartItem;

    note: string;

}