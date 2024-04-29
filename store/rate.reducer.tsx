import {createSlice} from "@reduxjs/toolkit";
import {addressResponseDTO, AddressResponseDTO} from "../model/address/AddressResponseAPI";
import {RateDTO, rateDTO} from "../model/order/OrderRequest";
import boolean from "async-validator/dist-types/validator/boolean";

export interface IRateState {
    rates: RateDTO;
    showModalAddRate: boolean,
    selecOrderItemRate: string,
    showModalFileUpload: boolean,
}

const initialState: IRateState = {
    rates: rateDTO,
    showModalAddRate: false,
    selecOrderItemRate: "",
    showModalFileUpload: false
}

const rateSlide = createSlice({
    name: 'rate',
    initialState,
    reducers: {
        setRate: (state, {payload}: { payload: RateDTO }) => ({
            ...state,
            rates : payload
        }),
        setShowModalAddRate: (state, {payload}: { payload: boolean }) => ({
            ...state,
            showModalAddRate : payload
        }),
        setShowModalFileUpload: (state, {payload}: { payload: boolean }) => ({
            ...state,
            showModalFileUpload: payload
        }),
        setSelectedOrderItemRate: (state, {payload}: { payload: string }) => ({
            ...state,
            selecOrderItemRate: payload
        })
    }
});

export const {setRate, setShowModalAddRate,setShowModalFileUpload,setSelectedOrderItemRate} = rateSlide.actions;
export default rateSlide.reducer;