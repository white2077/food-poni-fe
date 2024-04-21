import {createSlice} from "@reduxjs/toolkit";
import {IProductCard} from "../components/product-rows";

export const INITIAL_PRODUCT_LIST: IProductState = {
    products: [],
    isLoading: true
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
        setProductList: (state, { payload }: { payload: IProductState }) => ({
            ...state,
            products: payload.products,
            isLoading: payload.isLoading,
        }),
    }
});

export const {setProductList} = productListSlide.actions;
export default productListSlide.reducer;