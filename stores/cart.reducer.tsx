import {createSlice} from "@reduxjs/toolkit";

export interface ICartItem {

    id: string;

    thumbnail: string;

    name: string;

    price: number;

    quantity: number;

    note: string;

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
        addItem: (state, action: {payload: ICartItem}) => {
            const {id, quantity} = action.payload as ICartItem;
            const itemInCart = state.cartItems.find(
                (item) => item.id === id
            );
            if (itemInCart) itemInCart.quantity = quantity;
            else state.cartItems.push({...action.payload});
        },
        deleteItem: (state, action: {payload: {id: string}}) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload.id);
        },
        deleteAllItem: (state, action) => {
            state.cartItems = [];
        },
        setQuantity: (state, action: {payload: {id: string, value: number}}) => ({
            ...state,
            cartItems: state.cartItems.map((item) =>
                (item.id === action.payload.id) ? {...item, quantity: action.payload.value} : item)
        }),
        setNote: (state, action: {payload: {id: string, note: string}}) => {
            const { id, note } = action.payload;
            state.cartItems = state.cartItems.map((item) =>
                item.id === id ? { ...item, note: note || "" } : item
            );
        }
    }
});

export const {addItem, setQuantity, deleteItem, deleteAllItem, setNote} = cartSlide.actions;
export default cartSlide.reducer;