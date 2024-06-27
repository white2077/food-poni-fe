import {createSlice} from "@reduxjs/toolkit";
import {IRetailer} from "../pages/[pid]";

export interface ICart {

    id: string;

    name: string;

    cartItems: ICartItem[];

    isSelectedICart: boolean;

}

export interface ICartItem {

    id: string;

    thumbnail: string;

    name: string;

    price: number;

    quantity: number;

    note: string;

    retailer: IRetailer;

    isSelectedICartItem: boolean;

}

export interface ICartState {
    carts: ICart[];
    selectedAll: boolean;
}

const initialState: ICartState = {
    carts: [],
    selectedAll: false
}

const cartSlide = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: { payload: ICartItem }) => {
            action.payload.isSelectedICartItem = true;
            const {id, quantity, retailer} = action.payload;
            const cart = state.carts.find(cart => cart.id === retailer.id);
            if (cart) {
                const itemInCart = cart.cartItems.find(
                    (item) => item.id === id
                );
                if (itemInCart) itemInCart.quantity = quantity;
                else cart.cartItems.push(action.payload);
            } else {
                state.carts.push({id: retailer.id ?? "", name: retailer.username ?? "", cartItems: [action.payload],isSelectedICart: true})
            }
        },
        deleteItem: (state, action: { payload: { id: string, retailerId: string } }): void => {
            const {id, retailerId} = action.payload;
            const cart = state.carts.find(cart => cart.id === retailerId);
            if (cart) cart.cartItems = cart.cartItems.filter(item => item.id !== id);
        },
        deleteSelectedSoldItems: (state): void => {
            state.carts.forEach(cart => {
                cart.cartItems = cart.cartItems.filter(item => !item.isSelectedICartItem);
            });
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
        },
        setSelectedICartItem: (state, action: { payload: string }): void => {
            state.carts.forEach(cart => {
                const  cartItem = cart.cartItems.find(item => item.id === action.payload);
                if(cartItem) cartItem.isSelectedICartItem = !cartItem.isSelectedICartItem;
            })
        },
        setSelectedICart: (state, action: { payload: string }): void => {
            const cart = state.carts.find(cart => cart.id === action.payload);
            if(cart) {
                cart.isSelectedICart = !cart.isSelectedICart;
                cart.cartItems.forEach(item => item.isSelectedICartItem = cart.isSelectedICart);
            }
        },
        setSelectedAll: (state): void => {
            state.selectedAll = !state.selectedAll;
            state.carts.forEach(cart => {
                cart.isSelectedICart = state.selectedAll;
                cart.cartItems.forEach(item => item.isSelectedICartItem = state.selectedAll);
            });
        }
    }
});

export const {addItem, setQuantity, deleteItem, deleteAllItem, setNote,setSelectedICartItem,setSelectedICart,deleteSelectedSoldItems,setSelectedAll} = cartSlide.actions;
export default cartSlide.reducer;