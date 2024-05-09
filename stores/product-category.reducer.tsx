import {createSlice} from "@reduxjs/toolkit";

export interface IProductCategoryState {
    currentProductCategory: string;
}

const initialState: IProductCategoryState = {
    currentProductCategory: "all"
}

const productCategorySlide = createSlice({
    name: 'productCategory',
    initialState,
    reducers: {
        setSelectedProductCategory: (state, {payload}: { payload: string }) => {
            state.currentProductCategory = payload
        }
    }
});

export const {setSelectedProductCategory} = productCategorySlide.actions;
export default productCategorySlide.reducer;