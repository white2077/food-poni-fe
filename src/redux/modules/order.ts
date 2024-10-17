import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, select, take } from "redux-saga/effects";
import { notification } from "antd";
import { Order, Page } from "@/type/types";
import { createOrder, getOrderById, getOrdersPage } from "@/utils/api/order";
import { QueryParams } from "@/utils/api/common";
import { RootState } from "@/redux/store.ts";
import { CartState, deleteAllCartRequest } from "@/redux/modules/cart.ts";
import { NavigateFunction } from "react-router-dom";

export type OrderState = {
  readonly page: Page<Order[]>;
  readonly selectedOrder: Order | null;
  readonly form: {
    readonly orderItems: Array<{
      readonly quantity: number;
      readonly productDetail: {
        readonly id: string;
      };
      readonly toppings: Array<{
        readonly name: string;
        readonly price: number;
      }>;
      readonly type: string | null;
    }>;
    readonly shippingAddress: {
      readonly fullName: string;
      readonly phoneNumber: string;
      readonly address: string;
      readonly lon: number;
      readonly lat: number;
    };
    readonly payment: {
      readonly method: string;
      readonly status: string;
    };
  };
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
  form: {
    orderItems: [],
    shippingAddress: {
      fullName: "",
      phoneNumber: "",
      address: "",
      lon: 0,
      lat: 0,
    },
    payment: {
      method: "CASH",
      status: "PAYING",
    },
  },
  isFetchLoading: false,
  isCreateLoading: false,
};

const SLICE_NAME = "order";

const orderSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    fetchOrdersSuccess: (
      state,
      action: PayloadAction<{ page: Page<Order[]> }>,
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
      isLoadingSelectedOrder: false,
    }),
    fetchOrderFailure: (state) => ({
      ...state,
      isLoadingSelectedOrder: false,
    }),
    createOrderSuccess: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    createOrderFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateOrderItemsSuccess: (
      state,
      action: PayloadAction<{
        orderItems: OrderState["form"]["orderItems"];
      }>,
    ) => ({
      ...state,
      form: {
        ...state.form,
        orderItems: action.payload.orderItems,
      },
    }),
    updateShippingAddressSuccess: (
      state,
      {
        payload,
      }: {
        payload: {
          readonly fullName: string;
          readonly phoneNumber: string;
          readonly address: string;
          readonly lon: number;
          readonly lat: number;
        };
      },
    ) => ({
      ...state,
      form: {
        ...state.form,
        shippingAddress: payload,
      },
    }),
    updatePaymentSuccess: (
      state,
      action: {
        payload: {
          readonly method: string;
        };
      },
    ) => ({
      ...state,
      form: {
        ...state.form,
        payment: {
          ...state.form.payment,
          method: action.payload.method,
        },
      },
    }),
    checkCartItemsSuccess: (state, action: PayloadAction<string[]>) => ({
      ...state,
      cartItemIds: action.payload,
    }),
    updateCreateLoading: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
  },
});

export default orderSlice.reducer;

export const {
  checkCartItemsSuccess,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderSuccess,
  fetchOrderFailure,
  createOrderFailure,
  createOrderSuccess,
  updateOrderItemsSuccess,
  updateCreateLoading,
  updateFetchLoading,
  updatePaymentSuccess,
  updateShippingAddressSuccess,
} = orderSlice.actions;
export const updateOrderItemsAction = createAction<void>(
  `${SLICE_NAME}/updateOrderItemsRequest`,
);
export const updateShippingAddressAction = createAction<string>(
  `${SLICE_NAME}/updateShippingAddressRequest`,
);
export const checkCartItemsAction = createAction<void>(
  `${SLICE_NAME}/checkCartItemsRequest`,
);
export const fetchOrdersAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchOrdersRequest`,
);
export const fetchOrderAction = createAction<{ orderId: string }>(
  `${SLICE_NAME}/fetchOrderRequest`,
);
export const createOrderAction = createAction<{ navigate: NavigateFunction }>(
  `${SLICE_NAME}/createOrderRequest`,
);

function* handleFetchOrders() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchOrdersAction> = yield take(fetchOrdersAction);

    try {
      yield put(updateFetchLoading());
      const page: Page<Order[]> = yield call(getOrdersPage, queryParams);
      yield put(fetchOrdersSuccess({ page }));
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
      payload: { navigate },
    }: ReturnType<typeof createOrderAction> = yield take(createOrderAction);
    try {
      yield put(updateCreateLoading());
      const { orderItems, shippingAddress, payment }: OrderState["form"] =
        yield select((state: RootState) => state.order.form);
      const orderId: string = yield call(createOrder, {
        orderItems,
        shippingAddress,
        payment,
      });
      yield put(createOrderSuccess());
      yield put(deleteAllCartRequest());

      navigate("/don-hang/" + orderId);
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
    yield take(updateOrderItemsAction);
    const carts: CartState["page"]["content"] = yield select(
      (state: RootState) => state.cart.page.content,
    );
    const selectedCarts = carts.filter((it) => it.checked);

    yield put(
      updateOrderItemsSuccess({
        orderItems: selectedCarts.map((it) => {
          return {
            quantity: it.quantity,
            productDetail: { id: it.productDetail.id },
            toppings: it.toppings,
            type: it.type,
          };
        }),
      }),
    );
  }
}

function* handleUpdateShippingAddress() {
  while (true) {
    const { payload }: ReturnType<typeof updateShippingAddressAction> =
      yield take(updateShippingAddressAction);
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
  fork(handleUpdateShippingAddress),
];
