import {createSlice} from "@reduxjs/toolkit";
import {orderRequestDTO, OrderRequestDTO} from "../models/order/OrderRequest";

export interface IOrderState {
    orders: OrderRequestDTO,
    isLoadingOrderItem: boolean,
}

const initialState: IOrderState = {
    orders: orderRequestDTO,
    isLoadingOrderItem: true,
}

const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setLoadingOrderItem: (state, {payload}: { payload: boolean }) => ({
            ...state,
            isLoadingOrderItem: payload
        })
    }
});

export const {setLoadingOrderItem} = orderSlide.actions;
export default orderSlide.reducer;