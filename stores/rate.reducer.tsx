// import {rateDTO, RateDTO} from "../models/order/OrderRequest";
import {createSlice} from "@reduxjs/toolkit";
import {RateResponseDTO} from "../models/rate/RateResponseAPI";

export interface IRateState {
    rates: RateResponseDTO;
    showModalAddRate: boolean,
    selecOrderItemRate: string,
    showModalFileUpload: boolean,
    showModalRate: boolean,
}

const initialState: IRateState = {
    rates: {},
    showModalAddRate: false,
    selecOrderItemRate: "",
    showModalFileUpload: false,
    showModalRate: false,
}

const rateSlide = createSlice({
    name: 'rate',
    initialState,
    reducers: {
        setRate: (state, {payload}: { payload: RateResponseDTO }) => ({
            ...state,
            rates: payload
        }),
        setShowModalAddRate: (state, {payload}: { payload: boolean }) => ({
            ...state,
            showModalAddRate: payload
        }),
        setShowModalFileUpload: (state, {payload}: { payload: boolean }) => ({
            ...state,
            showModalFileUpload: payload
        }),
        setSelectedOrderItemRate: (state, {payload}: { payload: string }) => ({
            ...state,
            selecOrderItemRate: payload
        }),
        setShowModalRate: (state, {payload}: { payload: boolean }) => ({
            ...state,
            showModalRate: payload
        })
    }
});
export const {setRate, setShowModalAddRate
    , setShowModalFileUpload, setSelectedOrderItemRate
    , setShowModalRate  } = rateSlide.actions;
export default rateSlide.reducer;