import {createSlice} from "@reduxjs/toolkit";

export interface ICartItem
{
    id: string;
    thumbnail: string;
    name: string;
    price: number;
    quantity: number;
}

export interface ICartState
{
    cartItems: ICartItem[];
}

const initialState: ICartState = {
    cartItems: [],
}

const cartSlide = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProduct: (state, action) => {
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload.product]
            }
        }
    }
});

export const {addProduct} = cartSlide.actions;
export default cartSlide.reducer;