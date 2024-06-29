import {INITIAL_USER_API_RESPONSE, UserResponseDTO} from "../user/UserResponseAPI";
import {OrderItemResponseDTO} from "../order_item/OrderItemResponseAPI";
import {paymentInfo, PaymentInfo, shippingAddress, ShippingAddress} from "./OrderRequest";

export interface OrderResponseDTO {

    id: string;

    totalAmount: number;

    user: UserResponseDTO;

    orderItems: OrderItemResponseDTO[];

    shippingAddress: ShippingAddress;

    status: string;

    note: string;

    payment: PaymentInfo;

    createdDate: Date;

}

export const INITIAL_ORDER_RESPONSE_DTO: OrderResponseDTO = {

    id: '',

    totalAmount: 0,

    user: INITIAL_USER_API_RESPONSE,

    orderItems: [],

    shippingAddress: shippingAddress,

    status: '',

    note: '',

    payment: paymentInfo,

    createdDate: new Date()

}