import {createSlice} from "@reduxjs/toolkit";
import {Address, INITIAL_CURRENT_ADDRESS} from "../model/Address";

export interface IShippingAddressState {
    shippingAddress: Address;
}

const initialState: IShippingAddressState = {
    shippingAddress: INITIAL_CURRENT_ADDRESS
}

const addressSlide = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setCurrentShippingAddress: (state, {payload}: { payload: Address }) => ({
            ...state,
            shippingAddress: payload
        })
    }
});

export const {setCurrentShippingAddress} = addressSlide.actions;
export default addressSlide.reducer;