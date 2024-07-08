import {INITIAL_USER_API_RESPONSE, UserAPIResponse} from "../user/UserResponseAPI";
import {paymentInfo, PaymentInfo, shippingAddress, ShippingAddress} from "./OrderRequest";
import {OrderItemAPIResponse} from "../order_item/OrderItemResponseAPI";

export interface OrderAPIResponse {

    id: string;

    totalAmount: number;

    user: UserAPIResponse;

    orderItems: OrderItemAPIResponse[];

    shippingAddress: ShippingAddress;

    status: string;

    note: string;

    payment: PaymentInfo;

    createdDate: Date;

}

export const INITIAL_ORDER_API_RESPONSE: OrderAPIResponse = {

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