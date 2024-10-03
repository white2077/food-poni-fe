import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, take, put } from "redux-saga/effects";
import { notification } from "antd";
import { Order, Page } from "@/type/types";
import { getOrdersPage, getOrderById } from "@/utils/api/order";
import { QueryParams } from "@/utils/api/common";

export interface OrderState {
    readonly page: Page<Order[]>;
    readonly selectedOrder: Order | null;
    readonly isFetchLoading: boolean;
    readonly isLoadingSelectedOrder: boolean;
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
    isFetchLoading: false,
    isLoadingSelectedOrder: false
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
        fetchOrdersSuccess: (state, { payload }: { payload: Page<Order[]> }) => ({
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
        fetchOrderSuccess: (state, { payload }: { payload: Order }) => ({
            ...state,
            selectedOrder: payload,
            isLoadingSelectedOrder: false
        }),
        fetchOrderFailure: (state) => ({
            ...state,
            isLoadingSelectedOrder: false
        }),
    }
});

export const {
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    fetchOrderRequest,
    fetchOrderSuccess,
    fetchOrderFailure,
} = orderSlice.actions;

export default orderSlice.reducer;

function* handleFetchOrders() {
    while (true) {
        const { payload }: ReturnType<typeof fetchOrdersRequest> = yield take(fetchOrdersRequest.type);
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
        const { payload }: ReturnType<typeof fetchOrderRequest> = yield take(fetchOrderRequest.type);
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

export const orderSagas = [
    fork(handleFetchOrders),
    fork(handleFetchOrder)
];