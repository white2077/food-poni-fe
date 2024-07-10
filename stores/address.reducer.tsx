import {createSlice} from "@reduxjs/toolkit";
import {AddressAPIResponse, INITIAL_ADDRESS_API_RESPONSE} from "../models/address/AddressAPIResponse";

export interface IShippingAddressState {
    shippingAddress: AddressAPIResponse;
}

const initialState: IShippingAddressState = {
    shippingAddress: INITIAL_ADDRESS_API_RESPONSE
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