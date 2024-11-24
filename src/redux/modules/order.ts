import { OrderRequest } from "@/components/molecules/OrderForm";
import { Order, OrderStatus, Page } from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import {
  createOrderByCashOrPostPaid,
  createOrderByVNPay,
  getOrderById,
  getOrdersPageByCustomer,
  getOrdersPageByRetailer,
  getPostPaidOrders,
  updateStatus,
} from "@/utils/api/order";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { NavigateFunction } from "react-router-dom";
import { call, fork, put, race, take } from "redux-saga/effects";
import { deleteCartGroupSuccess, updateVisible } from "./cartGroup";
import { addMessageSuccess } from "./message";

export type OrderState = {
  readonly page: Page<
    Array<Order & { readonly isUpdateStatusLoading: boolean }>
  >;
  readonly selectedOrder: Order | null;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
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
};

const SLICE_NAME = "order";

const orderSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateLoadingForFetchingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchOrdersSuccess: (
      state,
      action: PayloadAction<{ page: OrderState["page"] }>
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
    updateLoadingForCreatingSuccess: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    updateLoadingForUpdatingStatus: (
      state,
      action: PayloadAction<{ oid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.oid) {
            return {
              ...order,
              isUpdateStatusLoading: true,
            };
          }
          return order;
        }),
      },
    }),
    updateOrderStatusSuccess: (
      state,
      action: PayloadAction<{ oid: string; orderStatus: OrderStatus }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.oid) {
            return {
              ...it,
              status: action.payload.orderStatus,
              isUpdateStatusLoading: false,
            };
          }
          return it;
        }),
      },
    }),
    updateOrderStatusFailure: (
      state,
      action: PayloadAction<{ oid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.oid) {
            return {
              ...order,
              isUpdateStatusLoading: false,
            };
          }
          return order;
        }),
      },
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
  updateLoadingForCreatingSuccess,
  updateFetchLoading,
  updateLoadingForUpdatingStatus,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
} = orderSlice.actions;
export const updateOrderItemsAction = createAction<void>(
  `${SLICE_NAME}/updateOrderItemsRequest`
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
export const fetchPostPaidOrdersAction = createAction<{
  ppid: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchPostPaidOrdersRequest`);
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
      fetPostPaidOrders,
    }: {
      fetchOrdersByCustomer: ReturnType<typeof fetchOrdersByCustomerAction>;
      fetOrdersByRetailer: ReturnType<typeof fetchOrdersByRetailerAction>;
      fetPostPaidOrders: ReturnType<typeof fetchPostPaidOrdersAction>;
    } = yield race({
      fetchOrdersByCustomer: take(fetchOrdersByCustomerAction),
      fetOrdersByRetailer: take(fetchOrdersByRetailerAction),
      fetPostPaidOrders: take(fetchPostPaidOrdersAction),
    });

    try {
      if (fetchOrdersByCustomer) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getOrdersPageByCustomer,
          fetchOrdersByCustomer.payload.queryParams
        );
        yield put(
          fetchOrdersSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isUpdateStatusLoading: false,
              })),
            },
          })
        );
      }

      if (fetOrdersByRetailer) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getOrdersPageByRetailer,
          fetOrdersByRetailer.payload.queryParams
        );
        yield put(
          fetchOrdersSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isUpdateStatusLoading: false,
              })),
            },
          })
        );
      }
      if (fetPostPaidOrders) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getPostPaidOrders,
          fetPostPaidOrders.payload.ppid,
          fetPostPaidOrders.payload.queryParams
        );
        yield put(
          fetchOrdersSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isUpdateStatusLoading: false,
              })),
            },
          })
        );
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
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
      yield put(addMessageSuccess({ error: e }));
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
      yield put(updateLoadingForCreatingSuccess());

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
      yield put(addMessageSuccess({ error: e }));

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
      yield put(updateLoadingForUpdatingStatus({ oid }));
      yield fork(updateOrderStatus, oid, orderStatus);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateOrderStatusFailure({ oid }));
    }
  }
}

function* updateOrderStatus(oid: string, orderStatus: OrderStatus) {
  yield call(updateStatus, oid, orderStatus);
  yield put(updateOrderStatusSuccess({ oid, orderStatus }));
}

export const orderSagas = [
  fork(handleFetchOrders),
  fork(handleFetchOrder),
  fork(handleCreateOrder),
  fork(handleUpdateOrderStatus),
];
