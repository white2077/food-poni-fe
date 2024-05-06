import {createSlice} from "@reduxjs/toolkit";
import {IRetailer} from "../pages/[pid]";

export interface ICart {

    id: string;

    name: string;

    cartItems: ICartItem[];

}

export interface ICartItem {

    id: string;

    thumbnail: string;

    name: string;

    price: number;

    quantity: number;

    note: string;

    retailer: IRetailer;

}

export interface ICartState {
    carts: ICart[];
}

const initialState: ICartState = {
    carts: []
}

const cartSlide = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: { payload: ICartItem }) => {
            const {id, quantity, retailer} = action.payload;
            const cart = state.carts.find(cart => cart.id === retailer.id);
            if (cart) {
                const itemInCart = cart.cartItems.find(
                    (item) => item.id === id
                );
                if (itemInCart) itemInCart.quantity = quantity;
                else cart.cartItems.push(action.payload);
            } else {
                state.carts.push({id: retailer.id ?? "", name: retailer.username ?? "", cartItems: [action.payload]})
            }
        },
        deleteItem: (state, action: { payload: { id: string, retailerId: string } }): void => {
            const {id, retailerId} = action.payload;
            const cart = state.carts.find(cart => cart.id === retailerId);
            if (cart) cart.cartItems = cart.cartItems.filter(item => item.id !== id);
        },
        deleteAllItem: (state, action) => {
            state.carts = [];
        },
        setQuantity: (state, action: { payload: { id: string, retailerId: string, value: number } }): void => {
            const {id, retailerId, value} = action.payload;
            const cart = state.carts.find(cart => cart.id === retailerId);
            if (cart) cart.cartItems = cart.cartItems.map(item => item.id === id ? {...item, quantity: value} : item);
        },
        setNote: (state, action: { payload: { id: string, retailerId: string, note: string } }): void => {
            const {id, retailerId, note} = action.payload;
            const cart = state.carts.find(cart => cart.id === retailerId);
            if (cart) cart.cartItems = cart.cartItems.map(item => item.id === id ? {...item, note: note || ""} : item);
        }
    }
});

export const {addItem, setQuantity, deleteItem, deleteAllItem, setNote} = cartSlide.actions;
export default cartSlide.reducer;