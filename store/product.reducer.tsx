import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CurrentUser} from "../model/User";
import {Product} from "../model/Product";
import {IProductCard} from "../components/product-rows";

export const INITIAL_PRODUCT_LIST = {
    products: [],
    isLoading: false
};

export interface IProductState {
    products: IProductCard[],
    isLoading: boolean
}

const initialState: IProductState = {
    ...INITIAL_PRODUCT_LIST
}

const productListSlide = createSlice({
    name: 'productList',
    initialState,
    reducers: {
        setProductList: (state, { payload }: { payload: IProductCard[] }) => ({
            ...state,
            products: payload,
        }),
        setLoading: (state, { payload }: { payload: boolean }) => ({
            ...state,
            isLoading: payload,
        }),
    }
});

export const {setProductList, setLoading} = productListSlide.actions;
export default productListSlide.reducer;