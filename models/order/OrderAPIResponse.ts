import {UserAPIResponse} from "../user/UserResponseAPI";
import {PaymentInfo, ShippingAddress} from "./OrderRequest";
import {OrderItemAPIResponse} from "../order_item/OrderItemAPIResponse";

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