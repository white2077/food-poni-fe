import {User} from "./User";
import {IPaymentInfo, IShippingAddress} from "../store/order.reducer";
import {ProductDetail} from "./ProductDetail";

export interface Order {

    id: string;

    totalAmount: number;

    user: User;

    orderItems: OrderItem[];

    shippingAddress: IShippingAddress;

    status: string;

    note: string;

    payment: IPaymentInfo;

    createdDate: string;

}

export interface OrderItem {

    id: string;

    quantity: number;

    price: number;

    productDetail: ProductDetail;

    note: string;

}