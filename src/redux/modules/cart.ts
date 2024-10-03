import {createSlice} from "@reduxjs/toolkit";
import {Page} from "@/type/types.ts";
import {call, cancel, delay, fork, put, race, select, take} from "redux-saga/effects";
import {notification} from "antd";
import {QueryParams} from "@/utils/api/common.ts";
import {
    createCart,
    deleteAllCart,
    deleteCart,
    getCartsPage,
    updateCartAllChecked,
    updateCartChecked,
    updateCartQuantity
} from "@/utils/api/cart.ts";
import {RootState} from "@/redux/store.ts";
import {Task} from "redux-saga";

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
    readonly isAllChecked: boolean
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
    isCreateLoading: false,
    isAllChecked: false
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
        }) => {
            const isAnyChecked = payload.content.every(cart => cart.checked);
            return {
                ...state,
                page: payload,
                isFetchLoading: false,
                isAllChecked: isAnyChecked
            };
        },
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
                quantity: number;
                productName: string;
                productDetail: {
                    id: string;
                    name: string;
                    price: number;
                    images: string[];
                }
                checked: boolean;
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
        updateDecreaseQuantityRequest: (state, {payload}: { payload: { pdid: string } }) => ({
            ...state,
            isUpdateLoading: true
        }),
        updateIncreaseQuantityRequest: (state, {payload}: { payload: { pdid: string } }) => ({
            ...state,
            isUpdateLoading: true
        }),
        updateQuantityRequest: (state, {payload}: { payload: { pdid: string, quantity: number } }) => ({
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
        updateQuantityFailure: (state) => ({
            ...state,
            isUpdateLoading: false
        }),
        updateCheckedRequest: (state, {payload}: { payload: { pdid: string, checked: boolean } }) => ({
            ...state,
            isUpdateLoading: true
        }),
        updateCheckedSuccess: (state, {payload}: { payload: { pdid: string, checked: boolean } }) => {
            const updatedContent = state.page.content.map(cart => {
                if (cart.productDetail.id === payload.pdid) {
                    return {
                        ...cart,
                        checked: payload.checked
                    };
                }
                return cart;
            });
            const isAnyChecked = updatedContent.every(cart => cart.checked);
            return {
                ...state,
                page: {
                    ...state.page,
                    content: updatedContent
                },
                isUpdateLoading: false,
                isAllChecked: isAnyChecked
            };
        },
        updateCheckedFailure: (state) => ({
            ...state,
            isUpdateLoading: false
        }),
        updateAllCheckedRequest: (state) => ({
            ...state,
            isUpdateLoading: true
        }),
        updateAllCheckedSuccess: (state, {payload}: { payload: { checked: boolean } }) => {
            const updatedContent = state.page.content.map(cart => {
                return {
                    ...cart,
                    checked: !payload.checked
                };
            });
            const isAnyChecked = updatedContent.some(cart => cart.checked);
            return {
                ...state,
                page: {
                    ...state.page,
                    content: updatedContent
                },
                isUpdateLoading: false,
                isAllChecked: isAnyChecked
            };
        },
        updateAllCheckedFailure: (state) => ({
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
        }),
        deleteAllCartRequest: (state) => ({
            ...state,
            isDeleteLoading: true
        }),
        deleteAllCartSuccess: (state) => ({
            ...state,
            page: {
                ...state.page,
                content: [],
                totalElements: 0
            },
            isDeleteLoading: false
        }),
        deleteAllCartFailure: (state) => ({
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
    updateQuantityRequest,
    updateQuantitySuccess,
    updateQuantityFailure,
    updateCheckedRequest,
    updateCheckedSuccess,
    updateCheckedFailure,
    updateAllCheckedRequest,
    updateAllCheckedSuccess,
    updateAllCheckedFailure,
    deleteCartRequest,
    deleteCartSuccess,
    deleteCartFailure,
    deleteAllCartRequest,
    deleteAllCartSuccess,
    deleteAllCartFailure
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
                quantity: payload.quantity,
                productName: payload.productName + " - " + payload.productDetailName,
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

function* handleDelay(pdid: string, quantity: number) {
    yield delay(500);
    yield call(updateCartQuantity, {
        pdid: pdid,
        quantity: quantity
    });
}

function* handleUpdateQuantityCart() {
    let task: Task | null = null;
    while (true) {
        const {updateDecreaseQuantity, updateIncreaseQuantity, updateQuantity}: {
            updateDecreaseQuantity: ReturnType<typeof updateDecreaseQuantityRequest>,
            updateIncreaseQuantity: ReturnType<typeof updateIncreaseQuantityRequest>,
            updateQuantity: ReturnType<typeof updateQuantityRequest>
        } = yield race({
            updateDecreaseQuantity: take(updateDecreaseQuantityRequest.type),
            updateIncreaseQuantity: take(updateIncreaseQuantityRequest.type),
            updateQuantity: take(updateQuantityRequest.type)
        });
        try {
            if (updateDecreaseQuantity) {
                const {quantity} = yield select((state: RootState) => state.cart.page.content.find(cart => cart.productDetail.id === updateDecreaseQuantity.payload.pdid));
                yield call(updateCartQuantity, {
                    pdid: updateDecreaseQuantity.payload.pdid,
                    quantity: quantity - 1
                });

                yield put(updateQuantitySuccess({
                    pdid: updateDecreaseQuantity.payload.pdid,
                    quantity: quantity - 1
                }));
            }
            if (updateIncreaseQuantity) {
                const {quantity} = yield select((state: RootState) => state.cart.page.content.find(cart => cart.productDetail.id === updateIncreaseQuantity.payload.pdid));
                yield call(updateCartQuantity, {
                    pdid: updateIncreaseQuantity.payload.pdid,
                    quantity: quantity + 1
                });

                yield put(updateQuantitySuccess({
                    pdid: updateIncreaseQuantity.payload.pdid,
                    quantity: quantity + 1
                }));
            }
            if (updateQuantity) {
                if (task) {
                    yield cancel(task);
                    task = null;
                }
                task = yield fork(handleDelay, updateQuantity.payload.pdid, updateQuantity.payload.quantity);
                yield put(updateQuantitySuccess({
                    pdid: updateQuantity.payload.pdid,
                    quantity: updateQuantity.payload.quantity
                }));
            }
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });
            yield put(updateQuantityFailure());
        }
    }
}

function* handleUpdateCheckedCart() {
    while (true) {
        const {payload}: ReturnType<typeof updateCheckedRequest> = yield take(updateCheckedRequest.type);
        try {
            yield call(updateCartChecked, {pdid: payload.pdid, checked: payload.checked});
            yield put(updateCheckedSuccess({pdid: payload.pdid, checked: payload.checked}));
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });
            yield put(updateCheckedFailure());
        }
    }
}

function* handleUpdateAllCheckedCart() {
    while (true) {
        yield take(updateAllCheckedRequest.type);
        try {
            yield call(updateCartAllChecked);
            const isAnyChecked: boolean = yield select((state: RootState) => state.cart.page.content.every(cart => cart.checked));
            yield put(updateAllCheckedSuccess({checked: isAnyChecked}));
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });
            yield put(updateAllCheckedFailure());
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

function* handleDeleteAllCart() {
    while (true) {
        yield take(deleteAllCartRequest.type);
        try {
            yield call(deleteAllCart);
            yield put(deleteAllCartSuccess());
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });
            yield put(deleteAllCartFailure());
        }
    }
}

export const cartSagas = [
    fork(handleFetchCart),
    fork(handleCreateCart),
    fork(handleUpdateQuantityCart),
    fork(handleUpdateCheckedCart),
    fork(handleUpdateAllCheckedCart),
    fork(handleDeleteCart),
    fork(handleDeleteAllCart)
];