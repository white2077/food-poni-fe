import {createSlice} from "@reduxjs/toolkit";
import {OrderCreationRequestDTO} from "../models/order/OrderRequest";

export interface IOrderState {
    orders: OrderCreationRequestDTO,
    isLoadingOrderItem: boolean,
}

const initialState: IOrderState = {
    orders: {} as OrderCreationRequestDTO,
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
