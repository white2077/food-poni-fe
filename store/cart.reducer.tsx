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
        addItem: (state, action) => {
            const {id, quantity} = action.payload as ICartItem;
            const itemInCart = state.cartItems.find(
                (item) => item.id === id
            );
            if (itemInCart) itemInCart.quantity = quantity;
            else state.cartItems.push({...action.payload});
        },
        deleteItem: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload.id);
        },
        setQuantity: (state, action) => ({
            ...state,
            cartItems: state.cartItems.map((item) =>
                (item.id === action.payload.id) ? {...item, quantity: action.payload.value} : item)
        }),
        setNote: (state, action) => {
            const { id, note } = action.payload;
            state.cartItems = state.cartItems.map((item) =>
                item.id === id ? { ...item, note: note || "" } : item
            );
        }
    }
});

export const {addItem, setQuantity, deleteItem, setNote} = cartSlide.actions;
export default cartSlide.reducer;