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

const SLICE_NAME = 'order';

const orderSlide = createSlice({
    name: SLICE_NAME,
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
