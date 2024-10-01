import {createSlice} from "@reduxjs/toolkit";
import {Page} from "@/type/types.ts";
import {call, fork, put, race, select, take} from "redux-saga/effects";
import {notification} from "antd";
import {QueryParams} from "@/utils/api/common.ts";
import {createCart, deleteCart, getCartsPage, updateCartQuantity} from "@/utils/api/cart.ts";
import {RootState} from "@/redux/store.ts";

export type CartState = {
    readonly page: Page<{
        readonly quantity: number;
        readonly productName: string;
        readonly productDetail: {
            readonly id: string;
            readonly name: string;
            readonly price: number;
            readonly images: string[];
        }
        readonly checked: boolean;
    }[]>,
    readonly isFetchLoading: boolean,
    readonly isUpdateLoading: boolean,
    readonly isDeleteLoading: boolean,
    readonly isCreateLoading: boolean,
}

const initialState: CartState = {
    page: {
        content: [
            {
                quantity: 1,
                productName: "",
                productDetail: {
                    id: "",
                    name: "",
                    price: 1,
                    images: [""],
                },
                checked: true
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
    isFetchLoading: false,
    isUpdateLoading: false,
    isDeleteLoading: false,
    isCreateLoading: false
}

const SLICE_NAME = 'cart';

const cartListSlide = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        fetchCartRequest: (state, {payload}: { payload: string | undefined }) => ({
            ...state,
            isFetchLoading: true
        }),
        fetchCartSuccess: (state, {payload}: {
            payload: Page<{
                readonly quantity: number;
                readonly productName: string;
                readonly productDetail: {
                    readonly id: string;
                    readonly name: string;
                    readonly price: number;
                    readonly images: string[];
                }
                readonly checked: boolean;
            }[]>
        }) => ({
            ...state,
            page: payload,
            isFetchLoading: false
        }),
        fetchCartFailure: (state) => ({
            ...state,
            isFetchLoading: false
        }),
        createCartRequest: (state, {payload}: {
            payload: {
                quantity: number,
                productDetail: string,
                productName: string,
                productDetailName: string,
                price: number,
                thumbnail: string
            }
        }) => ({
            ...state,
            isCreateLoading: true
        }),
        createCartSuccess: (state, {payload}: {
            payload: {
                readonly quantity: number;
                readonly productName: string;
                readonly productDetail: {
                    readonly id: string;
                    readonly name: string;
                    readonly price: number;
                    readonly images: string[];
                }
                readonly checked: boolean;
            }
        }) => ({
            ...state,
            page: {
                ...state.page,
                content: [payload, ...state.page.content],
                totalElements: state.page.totalElements + 1
            },
            isCreateLoading: false
        }),
        createCartFailure: (state) => ({
            ...state,
            isCreateLoading: false
        }),
        updateDecreaseQuantityRequest: (state, {payload}: { payload: string }) => ({
            ...state,
            isUpdateLoading: true
        }),
        updateIncreaseQuantityRequest: (state, {payload}: { payload: string }) => ({
            ...state,
            isUpdateLoading: true
        }),
        updateQuantitySuccess: (state, {payload}: { payload: { pdid: string, quantity: number } }) => ({
            ...state,
            page: {
                ...state.page,
                content: state.page.content.map(cart => {
                    if (cart.productDetail.id === payload.pdid) {
                        return {
                            ...cart,
                            quantity: payload.quantity
                        }
                    }
                    return cart
                })
            },
            isUpdateLoading: false
        }),
        updateQuantityFailure: (state, {payload}: { payload: string }) => ({
            ...state,
            isUpdateLoading: false
        }),
        deleteCartRequest: (state, {payload}: { payload: string }) => ({
            ...state,
            isDeleteLoading: true
        }),
        deleteCartSuccess: (state, {payload}: { payload: string }) => ({
            ...state,
            page: {
                ...state.page,
                content: state.page.content.filter(cart => cart.productDetail.id !== payload),
                totalElements: state.page.totalElements - 1
            },
            isDeleteLoading: false
        }),
        deleteCartFailure: (state, {payload}: { payload: string }) => ({
            ...state,
            isDeleteLoading: false
        })
    }
});
export default cartListSlide.reducer;

export const {
    fetchCartRequest,
    fetchCartSuccess,
    fetchCartFailure,
    createCartRequest,
    createCartSuccess,
    createCartFailure,
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
            const page: Page<{
                readonly quantity: number;
                readonly productName: string;
                readonly productDetail: {
                    readonly id: string;
                    readonly name: string;
                    readonly price: number;
                    readonly images: string[];
                }
                readonly checked: boolean;
            }[]> = yield call(getCartsPage, queryParams);
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

function* handleCreateCart() {
    while (true) {
        const {payload}: ReturnType<typeof createCartRequest> = yield take(createCartRequest.type);
        try {
            yield call(createCart, {quantity: payload.quantity, productDetail: payload.productDetail});
            const cart: {
                readonly quantity: number;
                readonly productName: string;
                readonly productDetail: {
                    readonly id: string;
                    readonly name: string;
                    readonly price: number;
                    readonly images: string[];
                }
                readonly checked: boolean;
            } = {
                quantity: 1,
                productName: payload.productName,
                productDetail: {
                    id: payload.productDetail,
                    name: payload.productDetailName,
                    price: payload.price,
                    images: [payload.thumbnail],
                },
                checked: true
            }
            yield put(createCartSuccess(cart));
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });

            yield put(createCartFailure());
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

            const {quantity} = yield select((state: RootState) => state.cart.page.content.find(cart => cart.productDetail.id === updateAction.payload));

            yield call(updateCartQuantity, {
                pdid: updateAction.payload,
                quantity: updateAction === updateDecreaseQuantity ? quantity - 1 : quantity + 1
            });
            yield put(updateQuantitySuccess({
                pdid: updateAction.payload,
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

export const cartSagas = [fork(handleFetchCart), fork(handleCreateCart), fork(handleUpdateQuantityCart), fork(handleDeleteCart)];