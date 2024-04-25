import {ICartItem} from "../../store/cart.reducer";

export interface OrderItemRequestDTO {

    quantity: number;

    productDetail: ICartItem;

    note: string;

}