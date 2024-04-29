import {UserResponseDTO} from "../user/UserResponseAPI";
import {OrderItemResponseDTO} from "../order_item/OrderItemResponseAPI";
import {PaymentInfo, ShippingAddress} from "./OrderRequest";
import { RateResponseDTO} from "../rate/RateResponseAPI";

export interface OrderResponseDTO {

    id: string;

    totalAmount: number;

    user: UserResponseDTO;

    orderItems: OrderItemResponseDTO[];

    shippingAddress: ShippingAddress;

    status: string;

    note: string;

    payment: PaymentInfo;

    createdDate: string;

}