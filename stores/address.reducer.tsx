import {createSlice} from "@reduxjs/toolkit";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";

export interface IShippingAddressState {
    shippingAddress: AddressResponseDTO;
}

const initialState: IShippingAddressState = {
    shippingAddress: {}
}

const addressSlide = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setCurrentShippingAddress: (state, {payload}: { payload: AddressResponseDTO }) => ({
            ...state,
            shippingAddress: payload
        })
    }
});

export const {setCurrentShippingAddress} = addressSlide.actions;
export default addressSlide.reducer;