import {createSlice} from "@reduxjs/toolkit";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";

export interface IShippingAddressState {
    shippingAddress: AddressAPIResponse;
}

const initialState: IShippingAddressState = {
    shippingAddress: {} as AddressAPIResponse
}

const SLICE_NAME = 'address';

const addressSlide = createSlice({
    name: SLICE_NAME,
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