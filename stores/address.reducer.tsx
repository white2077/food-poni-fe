import {createSlice} from "@reduxjs/toolkit";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";

export interface IShippingAddressState {
    shippingAddress: AddressAPIResponse;
}

const initialState: IShippingAddressState = {
    shippingAddress: {}
}

const addressSlide = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setCurrentShippingAddress: (state, {payload}: { payload: AddressAPIResponse }) => ({
            ...state,
            shippingAddress: payload
        })
    }
});

export const {setCurrentShippingAddress} = addressSlide.actions;
export default addressSlide.reducer;