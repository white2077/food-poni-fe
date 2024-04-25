import {createSlice} from "@reduxjs/toolkit";
import {orderRequestDTO, OrderRequestDTO} from "../model/order/OrderRequest";

export interface IOrderState {
    orders: OrderRequestDTO;
}

const initialState: IOrderState = {
    orders: orderRequestDTO
}

const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {

    }
});

// export const {} = orderSlide.actions;
export default orderSlide.reducer;