import { OrderRequest } from "@/components/molecules/OrderForm";
import { Order, OrderStatus, Page } from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import {
  createOrderByCashOrPostPaid,
  createOrderByVNPay,
  getOrderById,
  getOrdersPageByCustomer,
  getOrdersPageByRetailer,
  updateStatus,
} from "@/utils/api/order";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { NavigateFunction } from "react-router-dom";
import { call, fork, put, race, take } from "redux-saga/effects";
import { deleteCartGroupSuccess, updateVisible } from "./cartGroup";

export type OrderState = {
  readonly page: Page<Order[]>;
  readonly selectedOrder: Order | null;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
  readonly isUpdateLoading: boolean;
};

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
  isCreateLoading: false,
  isUpdateLoading: false,
};

const SLICE_NAME = "order";

const orderSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    fetchOrdersSuccess: (
      state,
      action: PayloadAction<{ page: Page<Order[]> }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchOrdersFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    fetchOrderSuccess: (state, action: PayloadAction<{ order: Order }>) => ({
      ...state,
      selectedOrder: action.payload.order,
      isFetchLoading: false,
    }),
    fetchOrderFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    createOrderSuccess: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    createOrderFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateCreateLoading: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    updateLoadingForUpdatingStatus: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    updateOrderStatusSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateOrderStatusFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
  },
});

export default orderSlice.reducer;

export const {
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderSuccess,
  fetchOrderFailure,
  createOrderFailure,
  createOrderSuccess,
  updateCreateLoading,
  updateFetchLoading,
  updateLoadingForUpdatingStatus,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
} = orderSlice.actions;
export const updateOrderItemsAction = createAction<void>(
  `${SLICE_NAME}/updateOrderItemsRequest`
);
export const updateShippingAddressAction = createAction<{ sid: string | null }>(
  `${SLICE_NAME}/updateShippingAddressRequest`
);
export const checkCartItemsAction = createAction<void>(
  `${SLICE_NAME}/checkCartItemsRequest`
);
export const fetchOrdersByCustomerAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchOrdersByCustomerRequest`);
export const fetchOrdersByRetailerAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchOrdersByRetailerRequest`);
export const fetchOrderAction = createAction<{ orderId: string }>(
  `${SLICE_NAME}/fetchOrderRequest`
);
export const createOrderAction = createAction<{
  navigate: NavigateFunction;
  values: OrderRequest;
}>(`${SLICE_NAME}/createOrderRequest`);
export const createOrderGroupAction = createAction<{
  navigate: NavigateFunction;
  values: OrderRequest;
  roomId: string;
}>(`${SLICE_NAME}/createOrderGroupRequest`);
export const updateOrderStatusAction = createAction<{
  oid: string;
  orderStatus: OrderStatus;
}>(`${SLICE_NAME}/updateOrderStatusRequest`);

function* handleFetchOrders() {
  while (true) {
    const {
      fetchOrdersByCustomer,
      fetOrdersByRetailer,
    }: {
      fetchOrdersByCustomer: ReturnType<typeof fetchOrdersByCustomerAction>;
      fetOrdersByRetailer: ReturnType<typeof fetchOrdersByRetailerAction>;
    } = yield race({
      fetchOrdersByCustomer: take(fetchOrdersByCustomerAction),
      fetOrdersByRetailer: take(fetchOrdersByRetailerAction),
    });

    try {
      if (fetchOrdersByCustomer) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getOrdersPageByCustomer,
          fetchOrdersByCustomer.payload.queryParams
        );
        yield put(fetchOrdersSuccess({ page }));
      }

      if (fetOrdersByRetailer) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getOrdersPageByRetailer,
          fetOrdersByRetailer.payload.queryParams
        );
        yield put(fetchOrdersSuccess({ page }));
      }
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(fetchOrdersFailure());
    }
  }
}

function* handleFetchOrder() {
  while (true) {
    const {
      payload: { orderId },
    }: ReturnType<typeof fetchOrderAction> = yield take(fetchOrderAction);

    try {
      yield put(updateFetchLoading());
      const order: Order = yield call(getOrderById, orderId);
      yield put(fetchOrderSuccess({ order }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(fetchOrderFailure());
    }
  }
}

function* handleCreateOrder() {
  while (true) {
    const {
      startCreateOrder,
      startCreateOrderGroup,
    }: {
      startCreateOrder: ReturnType<typeof createOrderAction>;
      startCreateOrderGroup: ReturnType<typeof createOrderGroupAction>;
    } = yield race({
      startCreateOrder: take(createOrderAction),
      startCreateOrderGroup: take(createOrderGroupAction),
    });

    try {
      yield put(updateCreateLoading());

      if (startCreateOrder) {
        const { navigate, values } = startCreateOrder.payload;

        if (values.paymentMethod === "VNPAY") {
          const vnpayUrl: string = yield call(
            createOrderByVNPay,
            values.addressId,
            values.note
          );
          window.location.href = vnpayUrl;
        } else {
          const orderId: string = yield call(
            createOrderByCashOrPostPaid,
            values.addressId,
            values.note,
            values.paymentMethod === "POSTPAID"
          );

          yield put(createOrderSuccess());

          navigate("/don-hang/" + orderId);

          notification.open({
            message: "Đơn hàng",
            description: "Bạn vừa đặt hàng thành công.",
            type: "success",
          });
        }
      }

      if (startCreateOrderGroup) {
        const { navigate, values, roomId } = startCreateOrderGroup.payload;

        if (values.paymentMethod === "VNPAY") {
          const { values } = startCreateOrderGroup.payload;
          const vnpayUrl: string = yield call(
            createOrderByVNPay,
            values.addressId,
            values.note,
            roomId
          );
          window.open(vnpayUrl, "_blank");
        } else {
          const orderId: string = yield call(
            createOrderByCashOrPostPaid,
            values.addressId,
            values.note,
            values.paymentMethod === "POSTPAID",
            roomId
          );

          yield put(createOrderSuccess());

          navigate("/don-hang-nhom/" + orderId);
          notification.open({
            message: "Đơn hàng",
            description: "Bạn vừa đặt hàng thành công.",
            type: "success",
          });
        }
        yield put(updateVisible({ isVisible: false }));
        yield put(deleteCartGroupSuccess({ roomId }));
      }
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

function* handleUpdateOrderStatus() {
  while (true) {
    const {
      payload: { oid, orderStatus },
    }: ReturnType<typeof updateOrderStatusAction> = yield take(
      updateOrderStatusAction
    );
    try {
      yield put(updateLoadingForUpdatingStatus());
      yield call(updateStatus, oid, orderStatus);
      yield put(updateOrderStatusSuccess());
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(updateOrderStatusFailure());
    }
  }
}

export const orderSagas = [
  fork(handleFetchOrders),
  fork(handleFetchOrder),
  fork(handleCreateOrder),
  fork(handleUpdateOrderStatus),
];
