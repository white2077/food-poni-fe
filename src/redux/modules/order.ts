import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {call, fork, put, select, take} from "redux-saga/effects";
import {notification} from "antd";
import {Order, Page} from "@/type/types";
import {createOrder, getOrderById, getOrdersPage} from "@/utils/api/order";
import {QueryParams} from "@/utils/api/common";
import {RootState} from "@/redux/store.ts";
import {deleteAllCartRequest} from "@/redux/modules/cart.ts";
import {NavigateFunction} from "react-router-dom";
import {loginRequest} from "@/redux/modules/auth.ts";

export type OrderState = {
    readonly page: Page<Order[]>;
    readonly selectedOrder: Order | null;
    readonly form: {
        readonly orderItems: {
            readonly quantity: number;
            readonly productDetail: {
                readonly id: string;
            };
        }[],
        readonly shippingAddress: {
            readonly fullName: string;
            readonly phoneNumber: string;
            readonly address: string;
            readonly lon: number;
            readonly lat: number;
        },
        readonly payment: {
            readonly method: string;
            readonly status: string;
        }
    };
    readonly isFetchLoading: boolean;
    readonly isLoadingSelectedOrder: boolean;
    readonly isCreateLoading: boolean;
}

const initialState: OrderState = {
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
    selectedOrder: null,
    form: {
        orderItems: [],
        shippingAddress: {
            fullName: "",
            phoneNumber: "",
            address: "",
            lon: 0,
            lat: 0
        },
        payment: {
            method: "CASH",
            status: "PAYING"
        }
    },
    isFetchLoading: false,
    isLoadingSelectedOrder: false,
    isCreateLoading: false
};

const SLICE_NAME = 'order';

const orderSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        fetchOrdersRequest: (state, action: PayloadAction<QueryParams>) => ({
            ...state,
            isFetchLoading: true
        }),
        fetchOrdersSuccess: (state, {payload}: { payload: Page<Order[]> }) => ({
            ...state,
            page: payload,
            isFetchLoading: false
        }),
        fetchOrdersFailure: (state) => ({
            ...state,
            isFetchLoading: false
        }),
        fetchOrderRequest: (state, action: PayloadAction<string>) => ({
            ...state,
            isLoadingSelectedOrder: true
        }),
        fetchOrderSuccess: (state, {payload}: { payload: Order }) => ({
            ...state,
            selectedOrder: payload,
            isLoadingSelectedOrder: false
        }),
        fetchOrderFailure: (state) => ({
            ...state,
            isLoadingSelectedOrder: false
        }),
        createOrderRequest: (state, {payload}: { payload: { navigate: NavigateFunction } }) => ({
            ...state,
            isCreateLoading: true
        }),
        createOrderSuccess: (state) => ({
            ...state,
            isCreateLoading: false
        }),
        createOrderFailure: (state) => ({
            ...state,
            isCreateLoading: false
        }),
        updateOrderItemsSuccess: (state, {payload}: {
            payload: {
                readonly quantity: number;
                readonly productDetail: {
                    readonly id: string;
                };
            }[]
        }) => ({
            ...state,
            form: {
                ...state.form,
                orderItems: payload
            }
        }),
        updateShippingAddressSuccess: (state, {payload}: {
            payload: {
                readonly fullName: string;
                readonly phoneNumber: string;
                readonly address: string;
                readonly lon: number;
                readonly lat: number;
            }
        }) => ({
            ...state,
            form: {
                ...state.form,
                shippingAddress: payload
            }
        }),
        updatePaymentSuccess: (state, {payload}: {
            payload: {
                readonly method: string;
                readonly status: string;
            }
        }) => ({
            ...state,
            form: {
                ...state.form,
                payment: payload
            }
        })
    }
});

export const {
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    fetchOrderRequest,
    fetchOrderSuccess,
    fetchOrderFailure,
    createOrderRequest,
    createOrderSuccess,
    createOrderFailure,
    updateOrderItemsSuccess,
    updateShippingAddressSuccess,
    updatePaymentSuccess
} = orderSlice.actions;

export default orderSlice.reducer;

export const updateOrderItemsAction = createAction<void>(`${SLICE_NAME}/updateOrderItemsRequest`);
export const updateShippingAddressAction = createAction<string>(`${SLICE_NAME}/updateShippingAddressRequest`);

function* handleFetchOrders() {
    while (true) {
        const {payload}: ReturnType<typeof fetchOrdersRequest> = yield take(fetchOrdersRequest.type);
        try {
            const queryParams: QueryParams = {
                pageSize: 10,
                page: payload.page || 0,
                sort: payload.sort
            };

            const page: Page<Order[]> = yield call(getOrdersPage, queryParams);
            yield put(fetchOrdersSuccess(page));
        } catch (e) {
            console.error('Lỗi khi tải danh sách đơn hàng:', e);
            notification.error({
                message: "Lỗi",
                description: e.message || "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.",
            });
            yield put(fetchOrdersFailure());
        }
    }
}

function* handleFetchOrder() {
    while (true) {
        const {payload}: ReturnType<typeof fetchOrderRequest> = yield take(fetchOrderRequest.type);
        try {
            const order: Order = yield call(getOrderById, payload, {});
            yield put(fetchOrderSuccess(order));
        } catch (e) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', e);
            notification.error({
                message: "Lỗi",
                description: e.message || "Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.",
            });
            yield put(fetchOrderFailure());
        }
    }
}

function* handleCreateOrder() {
    while (true) {
        const {payload}: ReturnType<typeof createOrderRequest> = yield take(createOrderRequest.type);
        try {
            const {orderItems, shippingAddress, payment}: {
                readonly orderItems: {
                    readonly quantity: number;
                    readonly productDetail: {
                        readonly id: string;
                    };
                }[],
                readonly shippingAddress: {
                    readonly fullName: string;
                    readonly phoneNumber: string;
                    readonly address: string;
                    readonly lon: number;
                    readonly lat: number;
                },
                readonly payment: {
                    readonly method: string;
                    readonly status: string;
                }
            } = yield select((state: RootState) => state.order.form);
            const response: string = yield call(createOrder, {orderItems, shippingAddress, payment});
            yield put(createOrderSuccess());
            yield put(deleteAllCartRequest());

            payload.navigate("/don-hang/" + response);
            notification.open({
                message: "Đơn hàng",
                description: "Bạn vừa đặt hàng.",
                type: "success",
            });
        } catch (e) {
            notification.open({
                message: "Error",
                description: e.message,
                type: "error",
            });

            yield put(createOrderFailure());
        }
    }
}

function* handleUpdateOrderItems() {
    while (true) {
        yield take(updateOrderItemsAction.type);
        const carts: {
            readonly quantity: number;
            readonly productName: string;
            readonly productDetail: {
                readonly id: string;
                readonly name: string;
                readonly price: number;
                readonly images: string[];
            }
            readonly checked: boolean;
            readonly isUpdateLoading: boolean;
            readonly isDeleteLoading: boolean;
        }[] = yield select((state: RootState) => state.cart.page.content);
        const selectedCarts = carts.filter((it) => it.checked);
        yield put(updateOrderItemsSuccess(selectedCarts));
    }
}

function* handleUpdateShippingAddress() {
    while (true) {
        const {payload}: ReturnType<typeof updateShippingAddressAction> = yield take(updateShippingAddressAction.type);
        const addresses: {
            readonly id: string;
            readonly fullName: string;
            readonly phoneNumber: string;
            readonly address: string;
            readonly lon: number;
            readonly lat: number;
        }[] = yield select((state: RootState) => state.address.page.content);
        const address = addresses.find((it) => it.id === payload);
        if (address) {
            yield put(updateShippingAddressSuccess(address));
        }
    }
}

export const orderSagas = [
    fork(handleFetchOrders),
    fork(handleFetchOrder),
    fork(handleCreateOrder),
    fork(handleUpdateOrderItems),
    fork(handleUpdateShippingAddress)
];