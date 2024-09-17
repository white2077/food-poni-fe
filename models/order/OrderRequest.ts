import {OrderItemRequestDTO} from "../order_item/OrderItemRequest";

export interface OrderCreationRequestDTO {

    orderItems: OrderItemRequestDTO[];

    shippingAddress: ShippingAddress;

    note: string;

    payment: PaymentInfo;

    retailerId: string;

}

export interface ShippingAddress {

    fullName: string;

    phoneNumber: string;

    address: string;

}

export interface PaymentInfo {

    method: string;

    status: string;

}