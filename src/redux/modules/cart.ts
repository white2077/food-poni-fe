import {createSlice} from "@reduxjs/toolkit";
import {Cart, Page} from "@/type/types.ts";
import {call, fork, put, take} from "redux-saga/effects";
import {notification} from "antd";
import {QueryParams} from "@/utils/api/common.ts";
import {getCartsPage} from "@/utils/api/cart.ts";

export type CartState = {
    readonly data: {
        readonly page: Page<Cart[]>,
        readonly isLoading: boolean
    },
}

const initialState: CartState = {
    data: {
        page: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: 0,
            number: 0,
            first: true,
            last: true,
            numberOfElements: 0,
            empty: true,
        },
        isLoading: true
    }
}

const SLICE_NAME = 'cart';

const cartListSlide = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        fetchCartRequest: (state, payload: { payload: string | undefined }) => ({
            ...state,
            data: {
                ...state.data,
                isLoading: true
            }
        }),
        fetchCartSuccess: (state, {payload}: { payload: Page<Cart[]> }) => ({
            ...state,
            data: {
                ...state.data,
                page: payload,
                isLoading: false
            }
        }),
        fetchCartFailure: (state) => ({
            ...state,
            data: {
                ...state.data,
                isLoading: false
            }
        }),
        decreaseQuantity: (state, action: { payload: { id: string } }) => {
            const {id} = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    page: {
                        ...state.data.page,
                        content: state.data.page.content.map(cart => {
                            if (cart.id === id) {
                                return {
                                    ...cart,
                                    quantity: cart.quantity - 1
                                }
                            }
                            return cart
                        })
                    }
                }
            }
        },
        increaseQuantity: (state, action: { payload: { id: string } }) => {
            const {id} = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    page: {
                        ...state.data.page,
                        content: state.data.page.content.map(cart => {
                            if (cart.id === id) {
                                return {
                                    ...cart,
                                    quantity: cart.quantity + 1
                                }
                            }
                            return cart
                        })
                    }
                }
            }
        }
        // addItem: (state, action: { payload: CartItem }) => {
        //     action.payload.isSelectedICartItem = true;
        //     const {id, quantity, retailer} = action.payload;
        //     const cart = state.carts.find(cart => cart.id === retailer.id);
        //     if (cart) {
        //         const itemInCart = cart.cartItems.find(
        //             (item) => item.id === id
        //         );
        //         if (itemInCart) itemInCart.quantity = quantity;
        //         else cart.cartItems.push(action.payload);
        //     } else {
        //         state.carts.push({
        //             id: retailer.id ?? "",
        //             name: retailer.username ?? "",
        //             cartItems: [action.payload],
        //             isSelectedICart: true
        //         })
        //     }
        // },
        // deleteItem: (state, action: { payload: { id: string, retailerId: string } }): void => {
        //     const {id, retailerId} = action.payload;
        //     const cartIndex = state.carts.findIndex(cart => cart.id === retailerId);
        //     if (cartIndex !== -1) {
        //         const cart = state.carts[cartIndex];
        //         cart.cartItems = cart.cartItems.filter(item => item.id !== id);
        //         if (cart.cartItems.length === 0) {
        //             state.carts.splice(cartIndex, 1);
        //         }
        //     }
        // },
        // deleteSelectedSoldItems: (state): void => {
        //     state.carts.forEach(cart => {
        //         cart.cartItems = cart.cartItems.filter(item => !item.isSelectedICartItem);
        //     });
        // },
        // deleteAllItem: (state, action) => {
        //     state.carts = [];
        // },
        // setQuantity: (state, action: { payload: { id: string, retailerId: string, value: number } }): void => {
        //     const {id, retailerId, value} = action.payload;
        //     const cart = state.carts.find(cart => cart.id === retailerId);
        //     if (cart) cart.cartItems = cart.cartItems.map(item => item.id === id ? {...item, quantity: value} : item);
        // },
        // setNote: (state, action: { payload: { id: string, retailerId: string, note: string } }): void => {
        //     const {id, retailerId, note} = action.payload;
        //     const cart = state.carts.find(cart => cart.id === retailerId);
        //     if (cart) cart.cartItems = cart.cartItems.map(item => item.id === id ? {...item, note: note || ""} : item);
        // },
        // setSelectedICartItem: (state, action: { payload: string }): void => {
        //     state.carts.forEach(cart => {
        //         const cartItem = cart.cartItems.find(item => item.id === action.payload);
        //         if (cartItem) cartItem.isSelectedICartItem = !cartItem.isSelectedICartItem;
        //     })
        // },
        // setSelectedICart: (state, action: { payload: string }): void => {
        //     const cart = state.carts.find(cart => cart.id === action.payload);
        //     if (cart) {
        //         cart.isSelectedICart = !cart.isSelectedICart;
        //         cart.cartItems.forEach(item => item.isSelectedICartItem = cart.isSelectedICart);
        //     }
        // },
        // setSelectedAll: (state): void => {
        //     state.selectedAll = !state.selectedAll;
        //     state.carts.forEach(cart => {
        //         cart.isSelectedICart = state.selectedAll;
        //         cart.cartItems.forEach(item => item.isSelectedICartItem = state.selectedAll);
        //     });
        // }
    }
});
export default cartListSlide.reducer;

export const {
    fetchCartRequest,
    fetchCartSuccess,
    fetchCartFailure,
    decreaseQuantity,
    increaseQuantity
} = cartListSlide.actions;

function* handleFetchCart() {
    while (true) {
        const {payload}: ReturnType<typeof fetchCartRequest> = yield take(fetchCartRequest.type);
        try {
            const queryParams: QueryParams = {
                pageSize: 10,
                page: 0,
                status: true
            };

            queryParams.sort = payload;
            const page: Page<Cart[]> = yield call(getCartsPage, queryParams);
            yield put(fetchCartSuccess(page));
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });

            yield put(fetchCartFailure());
        }
    }
}

export const cartSagas = [fork(handleFetchCart),];