import {createSlice} from "@reduxjs/toolkit";
import {Cart, Page} from "@/type/types.ts";
import {call, fork, put, race, select, take} from "redux-saga/effects";
import {notification} from "antd";
import {QueryParams} from "@/utils/api/common.ts";
import {deleteCart, getCartsPage, updateCartQuantity} from "@/utils/api/cart.ts";
import {RootState} from "@/redux/store.ts";

export type CartState = {
    readonly data: {
        readonly page: Page<Cart[]>,
        readonly isLoading: boolean
    },
}

const initialState: CartState = {
    data: {
        page: {
            content: [
                {
                    id: "123",
                    user: {
                        id: "123",
                        avatar: "123",
                        email: "123",
                        birthday: "123",
                        gender: true,
                        username: "123",
                        role: "123",
                        status: true
                    },
                    quantity: 1,
                    productName: "123",
                    productDetail: {
                        id: "123",
                        name: "123",
                        price: 1,
                        description: "123",
                        status: true,
                        images: ["123"],
                        rate: 1,
                        sales: 1,
                        rateCount: 1,
                        product: {
                            id: "123",
                            name: "123",
                            slug: "123",
                            shortDescription: "123",
                            thumbnail: "123",
                            status: true,
                            sales: 1,
                            rate: 1,
                            rateCount: 1,
                            minPrice: 1,
                            maxPrice: 1,
                            createdDate: new Date(),
                            updatedDate: new Date()
                        }
                    },
                    checked: true,
                    isUpdateLoading: false,
                    isDeleteLoading: false
                }
            ],
            totalElements: 0,
            totalPages: 0,
            size: 0,
            number: 0,
            first: true,
            last: true,
            numberOfElements: 0,
            empty: true,
        },
        isLoading: false
    }
}

const SLICE_NAME = 'cart';

const cartListSlide = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        fetchCartRequest: (state, {payload}: { payload: string | undefined }) => ({
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
        updateDecreaseQuantityRequest: (state, {payload}: { payload: string }) => ({
            ...state,
            data: {
                ...state.data,
                page: {
                    ...state.data.page,
                    content: state.data.page.content.map(cart => {
                        if (cart.id === payload) {
                            return {
                                ...cart,
                                isUpdateLoading: true
                            }
                        }
                        return cart
                    })
                }
            }
        }),
        updateIncreaseQuantityRequest: (state, {payload}: { payload: string }) => ({
            ...state,
            data: {
                ...state.data,
                page: {
                    ...state.data.page,
                    content: state.data.page.content.map(cart => {
                        if (cart.id === payload) {
                            return {
                                ...cart,
                                isUpdateLoading: true
                            }
                        }
                        return cart
                    })
                }
            }
        }),
        updateQuantitySuccess: (state, {payload}: { payload: { id: string, quantity: number } }) => ({
            ...state,
            data: {
                ...state.data,
                page: {
                    ...state.data.page,
                    content: state.data.page.content.map(cart => {
                        if (cart.id === payload.id) {
                            return {
                                ...cart,
                                quantity: payload.quantity,
                                isUpdateLoading: true
                            }
                        }
                        return cart
                    })
                }
            }
        }),
        updateQuantityFailure: (state, {payload}: { payload: string }) => ({
            ...state,
            data: {
                ...state.data,
                page: {
                    ...state.data.page,
                    content: state.data.page.content.map(cart => {
                        if (cart.id === payload) {
                            return {
                                ...cart,
                                isUpdateLoading: true
                            }
                        }
                        return cart
                    })
                }
            }
        }),
        deleteCartRequest: (state, {payload}: { payload: string }) => ({
            ...state,
            data: {
                ...state.data,
                page: {
                    ...state.data.page,
                    content: state.data.page.content.map(cart => {
                        if (cart.id === payload) {
                            return {
                                ...cart,
                                isDeleteLoading: true
                            }
                        }
                        return cart
                    })
                }
            }
        }),
        deleteCartSuccess: (state, {payload}: { payload: string }) => ({
            ...state,
            data: {
                ...state.data,
                page: {
                    ...state.data.page,
                    content: state.data.page.content.map(cart => {
                        if (cart.id === payload) {
                            return {
                                ...cart,
                                isDeleteLoading: false
                            }
                        }
                        return cart
                    })
                }
            }
        }),
        deleteCartFailure: (state, {payload}: { payload: string }) => ({
            ...state,
            data: {
                ...state.data,
                page: {
                    ...state.data.page,
                    content: state.data.page.content.map(cart => {
                        if (cart.id === payload) {
                            return {
                                ...cart,
                                isDeleteLoading: false
                            }
                        }
                        return cart
                    })
                }
            }
        })
    }
});
export default cartListSlide.reducer;

export const {
    fetchCartRequest,
    fetchCartSuccess,
    fetchCartFailure,
    updateDecreaseQuantityRequest,
    updateIncreaseQuantityRequest,
    updateQuantitySuccess,
    updateQuantityFailure,
    deleteCartRequest,
    deleteCartSuccess,
    deleteCartFailure,
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

function* handleUpdateQuantityCart() {
    while (true) {
        const {updateDecreaseQuantity, updateIncreaseQuantity}: {
            updateDecreaseQuantity: ReturnType<typeof updateDecreaseQuantityRequest>,
            updateIncreaseQuantity: ReturnType<typeof updateIncreaseQuantityRequest>
        } = yield race({
            updateDecreaseQuantity: take(updateDecreaseQuantityRequest.type),
            updateIncreaseQuantity: take(updateIncreaseQuantityRequest.type)
        })
        try {
            const updateAction = updateDecreaseQuantity || updateIncreaseQuantity;

            const {quantity} = yield select((state: RootState) => state.cart.data.page.content.find(cart => cart.id === updateAction.payload) as Cart);

            yield call(updateCartQuantity, {
                id: updateAction.payload,
                quantity: updateAction === updateDecreaseQuantity ? quantity - 1 : quantity + 1
            });
            yield put(updateQuantitySuccess({
                id: updateAction.payload,
                quantity: updateAction === updateDecreaseQuantity ? quantity - 1 : quantity + 1
            }));
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });
            yield put(updateQuantityFailure(updateDecreaseQuantity ? updateDecreaseQuantity.payload : updateIncreaseQuantity.payload));
        }
    }
}

function* handleDeleteCart() {
    while (true) {
        const {payload}: ReturnType<typeof deleteCartRequest> = yield take(deleteCartRequest.type);
        try {
            yield call(deleteCart, payload);
            yield put(deleteCartSuccess(payload));
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });
            yield put(deleteCartFailure(payload));
        }
    }
}

export const cartSagas = [fork(handleFetchCart), fork(handleUpdateQuantityCart), fork(handleDeleteCart)];