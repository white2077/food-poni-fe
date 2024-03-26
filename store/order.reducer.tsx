import {ICurrentUser} from "./user.reducer";
import {ICartItem} from "./cart.reducer";
import {createSlice} from "@reduxjs/toolkit";

export interface IOrderItem {

    id: string;

    currentUser: ICurrentUser;

    listItem: ICartItem[];

    note: string;

    paymentInfor: IPaymentInfo;

}

export interface IPaymentInfo {

    id: string;

    method: string;

    status: string;

}

export interface IOrderState {
    orderItems: IOrderItem[];
}

const initialState: IOrderState = {
    orderItems: []
}

const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {

    }
});

// export const {} = orderSlide.actions;
export default orderSlide.reducer;