import {ICartItem} from "./cart.reducer";
import {createSlice} from "@reduxjs/toolkit";

export interface IOrder {
    user: string;
    orderItems: IOrderItem[];
    orderAddress: string;
    note: string;
    payment: IPaymentInfo;
}

export interface IOrderItem {
    quantity: number;
    productDetail: ICartItem;
    note: string;
}

export interface IPaymentInfo {
    method: string;
    status: string;
}

export interface IOrderState {
    orders: IOrder[];
}

const initialState: IOrderState = {
    orders: []
}

const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {

    }
});

// export const {} = orderSlide.actions;
export default orderSlide.reducer;