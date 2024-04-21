import {ICartItem} from "./cart.reducer";
import {createSlice} from "@reduxjs/toolkit";

export interface IOrder {
    orderItems: IOrderItem[];
    shippingAddress: IShippingAddress;
    note: string;
    payment: IPaymentInfo;
}

export interface IOrderItem {
    quantity: number;
    productDetail: ICartItem;
    note: string;
}

export interface IShippingAddress {
    fullName: string;
    phoneNumber: string;
    address: string;
    lon: number;
    lat: number;
}

export interface IPaymentInfo {
    method: string;
    status: string;
}

export const INITIAL_ORDER = {
    user: "",
    orderItems: [],
    shippingAddress: {
        fullName: "",
        phoneNumber: "",
        address: "",
        lon: 0,
        lat: 0
    },
    note: "",
    payment: {
        method: "",
        status: ""
    }
}

export interface IOrderState {
    orders: IOrder;
}

const initialState: IOrderState = {
    orders: INITIAL_ORDER
}

const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {

    }
});

// export const {} = orderSlide.actions;
export default orderSlide.reducer;