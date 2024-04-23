import {createSlice} from "@reduxjs/toolkit";
import {DeliveryInformation} from "../model/DeliveryInformation";

export interface IDeliveryInformationState {
    deliveryInformationList: DeliveryInformation[];
}

const initialState: IDeliveryInformationState = {
    deliveryInformationList: []
}

const deliverySlide = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        setDeliveryInformationList: (state, {payload}: { payload: DeliveryInformation[] }) => ({
            ...state,
            deliveryInformationList: payload
        }),
        addDeliveryInformationList: (state, {payload}: { payload: DeliveryInformation }) => ({
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