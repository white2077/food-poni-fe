import {createSlice} from "@reduxjs/toolkit";

export interface ICartItem {
    id: string;
    thumbnail: string;
    name: string;
    price: number;
    quantity: number;
}

export interface ICartState {
    cartItems: ICartItem[];
}

const initialState: ICartState = {
    cartItems: [],
}

const cartSlide = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const {id, quantity} = action.payload as ICartItem;
            const itemInCart = state.cartItems.find(
                (item) => item.id === id
            );
            if (itemInCart) itemInCart.quantity = quantity;
            else state.cartItems.push({...action.payload});
        }
    }
});

export const {addItem} = cartSlide.actions;
export default cartSlide.reducer;