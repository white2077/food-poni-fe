import {createSlice} from "@reduxjs/toolkit";
import {AddressResponseDTO} from "../model/address/AddressResponseAPI";

export interface IDeliveryInformationState {
    deliveryInformationList: AddressResponseDTO[];
}

const initialState: IDeliveryInformationState = {
    deliveryInformationList: []
}

const deliverySlide = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        setDeliveryInformationList: (state, {payload}: { payload: AddressResponseDTO[] }) => ({
            ...state,
            deliveryInformationList: payload
        }),
        addDeliveryInformationList: (state, {payload}: { payload: AddressResponseDTO }) => ({
            ...state,
            deliveryInformationList: [...state.deliveryInformationList, payload]
        }),
        deleteDeliveryInformationList: (state, {payload}: { payload: string }) => ({
            ...state,
            deliveryInformationList: state.deliveryInformationList.filter(item => item.id !== payload)
        })
    }
});

export const {setDeliveryInformationList, addDeliveryInformationList, deleteDeliveryInformationList} = deliverySlide.actions;
export default deliverySlide.reducer;