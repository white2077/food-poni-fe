import {createSlice} from "@reduxjs/toolkit";
import {RateAPIResponse} from "../models/rate/RateAPIResponse";

export interface IRateState {
    rates: RateAPIResponse;
    showModalAddRate: boolean,
    selectOrderItemRate: string,
    showModalFileUpload: boolean,
    showModalRate: boolean,
}

const initialState: IRateState = {
    rates: {} as RateAPIResponse,
    showModalAddRate: false,
    selectOrderItemRate: "",
    showModalFileUpload: false,
    showModalRate: false,
}

const rateSlide = createSlice({
    name: 'rate',
    initialState,
    reducers: {
        setRate: (state, {payload}: { payload: RateAPIResponse }) => ({
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
            selectOrderItemRate: payload
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