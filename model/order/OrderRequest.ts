import {OrderItemRequestDTO} from "../order_item/OrderItemRequest";

export interface OrderRequestDTO {

    orderItems?: OrderItemRequestDTO[];

    shippingAddress?: ShippingAddress;

    note?: string;

    payment?: PaymentInfo;

}

export interface ShippingAddress {

    fullName?: string;

    phoneNumber?: string;

    address?: string;

}

export interface PaymentInfo {

    method?: string;

    status?: string;

}