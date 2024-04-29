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

export interface RateDTO {
    rate?: number,
    message?: String,
    images?: String[],
}

export const shippingAddress: ShippingAddress = {};

export const paymentInfo: PaymentInfo = {};

export const orderRequestDTO: OrderRequestDTO = {};

// export const rateDTO: RateDTO = {};

