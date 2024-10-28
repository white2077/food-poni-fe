import { ProductState } from "@/redux/modules/product.ts";
import { RootState } from "@/redux/store.ts";
import { Cart, CartGroup } from "@/type/types";
import {
  addCartItem,
  createCartGroup,
  deleteCartGroup,
  deleteCartItem,
  getCartGroups,
  joinCartGroup,
  leaveCartGroup,
  updateCartItemQuantity,
} from "@/utils/api/cartGroup";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { Task } from "redux-saga";
import {
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  take,
} from "redux-saga/effects";
import {
  createOrderFailure,
  createOrderSuccess,
  OrderState,
  updateCreateLoading,
} from "./order";
import { createOrder, createVNPayOrder } from "@/utils/api/order";

export type CartGroupState = {
  readonly isVisible: boolean;
  readonly windowSelected: "HOME" | "CART_GROUP";
  readonly cartGroupJoined: Array<{
    readonly roomId: string;
    readonly timeout: number;
    readonly user: {
      readonly id: string;
      readonly username: string;
      readonly avatar: string;
    };
    cartItems: Array<
      Cart & {
        readonly updatingQuantityLoading: boolean;
        readonly deletingCartItemLoading: boolean;
      }
    >;
    readonly deletingCartGroupLoading: boolean;
  }>;
  readonly cartGroupSelected: string;
  readonly roomCodeInputting: string;
  readonly roomTimeOutInputting: string;
  readonly fetchingCartGroupsLoading: boolean;
  readonly joiningCartGroupLoading: boolean;
  readonly leavingCartGroupLoading: boolean;
  readonly addingToCartItemLoading: boolean;
  readonly creatingCartGroupLoading: boolean;
};

const initialState: CartGroupState = {
  isVisible: false,
  windowSelected: "HOME",
  cartGroupJoined: [],
  cartGroupSelected: "",
  roomCodeInputting: "",
  roomTimeOutInputting: "",
  fetchingCartGroupsLoading: false,
  joiningCartGroupLoading: false,
  leavingCartGroupLoading: false,
  addingToCartItemLoading: false,
  creatingCartGroupLoading: false,
};

const SLICE_NAME = "cartGroup";

const cartGroupSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateVisible: (state) => ({
      ...state,
      isVisible: !state.isVisible,
    }),
    updateWindowSelected: (
      state,
      action: PayloadAction<{ window: "CART_GROUP" | "HOME" }>
    ) => ({
      ...state,
      windowSelected: action.payload.window,
    }),
    updateCartGroupSelected: (
      state,
      action: PayloadAction<{ roomId: string }>
    ) => ({
      ...state,
      cartGroupSelected: action.payload.roomId,
    }),
    updateJoiningCartGroupLoading: (state) => ({
      ...state,
      joiningCartGroupLoading: true,
    }),
    joinCartGroupSuccess: (
      state,
      action: PayloadAction<{
        cartGroup: CartGroupState["cartGroupJoined"][number];
      }>
    ) => ({
      ...state,
      cartGroupJoined: [...state.cartGroupJoined, action.payload.cartGroup],
      creatingCartGroupLoading: false,
      joiningCartGroupLoading: false,
    }),
    joinCartGroupFailure: (state) => ({
      ...state,
      joiningCartGroupLoading: false,
    }),
    updateRoomCodeInputting: (
      state,
      action: PayloadAction<{ value: string }>
    ) => ({
      ...state,
      roomCodeInputting: action.payload.value,
    }),
    updateRoomTimeOutInputting: (
      state,
      action: PayloadAction<{ value: string }>
    ) => ({
      ...state,
      roomTimeOutInputting: action.payload.value,
    }),
    updateAddingToCartItemsLoadingSuccess: (state) => ({
      ...state,
      addingToCartItemLoading: true,
    }),
    addToCartItemsSuccess: (
      state,
      action: PayloadAction<{
        cartItem: CartGroupState["cartGroupJoined"][number]["cartItems"][number];
        roomId: string;
      }>
    ) => ({
      ...state,
      cartGroupJoined: state.cartGroupJoined.map((it) => {
        if (it.roomId === action.payload.roomId) {
          return {
            ...it,
            cartItems: [...it.cartItems, action.payload.cartItem],
          };
        }
        return it;
      }),
      addingToCartItemLoading: false,
    }),
    addToCartItemsFailure: (state) => ({
      ...state,
      addingToCartItemLoading: false,
    }),
    updateCartItemQuantityLoadingSuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      cartGroupJoined: state.cartGroupJoined.map((group) => ({
        ...group,
        cartItems: group.cartItems.map((ci) => {
          if (ci.id === action.payload.id) {
            return {
              ...ci,
              updatingQuantityLoading: true,
            };
          }
          return ci;
        }),
      })),
    }),
    updateCartItemQuantitySuccess: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
      }>
    ) => ({
      ...state,
      cartGroupJoined: state.cartGroupJoined.map((group) => ({
        ...group,
        cartItems: group.cartItems.map((ci) => {
          if (ci.id === action.payload.id) {
            return {
              ...ci,
              quantity: action.payload.quantity,
              updatingQuantityLoading: false,
            };
          }
          return ci;
        }),
      })),
    }),
    updateCartItemQuantityFailure: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      cartGroupJoined: state.cartGroupJoined.map((group) => ({
        ...group,
        cartItems: group.cartItems.map((ci) => {
          if (ci.id === action.payload.id) {
            return {
              ...ci,
              updatingQuantityLoading: false,
            };
          }
          return ci;
        }),
      })),
    }),
    fetchCartGroupsRequest: (state) => ({
      ...state,
      fetchCartGroupsLoading: true,
    }),
    fetchCartGroupsSuccess: (
      state,
      action: PayloadAction<{ cartGroups: CartGroupState["cartGroupJoined"] }>
    ) => ({
      ...state,
      cartGroupJoined: action.payload.cartGroups,
      fetchCartGroupsLoading: false,
    }),
    fetchCartGroupsFailure: (state) => ({
      ...state,
      fetchCartGroupsLoading: false,
    }),
    deleteCartItemSuccess: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      cartGroupJoined: state.cartGroupJoined.map((group) => ({
        ...group,
        cartItems: group.cartItems.filter((ci) => ci.id !== action.payload.id),
      })),
    }),
    createCartGroupRequest: (state) => ({
      ...state,
      creatingCartGroupLoading: true,
    }),
    createCartGroupFailure: (state) => ({
      ...state,
      creatingCartGroupLoading: false,
    }),
    updateDeletingCartGroupLoadingSuccess: (
      state,
      action: PayloadAction<{ roomId: string }>
    ) => ({
      ...state,
      cartGroupJoined: state.cartGroupJoined.map((it) => {
        if (it.roomId === action.payload.roomId) {
          return {
            ...it,
            deletingCartGroupLoading: true,
          };
        }
        return it;
      }),
    }),
    deleteCartGroupSuccess: (
      state,
      action: PayloadAction<{ roomId: string }>
    ) => ({
      ...state,
      cartGroupJoined: state.cartGroupJoined.filter(
        (it) => it.roomId !== action.payload.roomId
      ),
      windowSelected: "HOME",
    }),
    deleteCartGroupFailure: (
      state,
      action: PayloadAction<{ roomId: string }>
    ) => ({
      ...state,
      cartGroupJoined: state.cartGroupJoined.map((it) => {
        if (it.roomId === action.payload.roomId) {
          return {
            ...it,
            deletingCartGroupLoading: false,
          };
        }
        return it;
      }),
    }),
    leaveCartGroupSuccess: (
      state,
      action: PayloadAction<{ roomId: string; userId?: string }>
    ) => ({
      ...state,
      cartGroupJoined: action.payload.userId
        ? state.cartGroupJoined.map((it) => {
            if (it.roomId === action.payload.roomId) {
              return {
                ...it,
                cartItems: it.cartItems.filter(
                  (ci) => ci.user && ci.user.id !== action.payload.userId
                ),
              };
            }
            return it;
          })
        : state.cartGroupJoined.filter(
            (it) => it.roomId !== action.payload.roomId
          ),
    }),
  },
});
export default cartGroupSlide.reducer;

export const {
  updateVisible,
  updateWindowSelected,
  updateCartGroupSelected,
  updateJoiningCartGroupLoading,
  joinCartGroupSuccess,
  joinCartGroupFailure,
  updateRoomCodeInputting,
  updateRoomTimeOutInputting,
  updateAddingToCartItemsLoadingSuccess,
  addToCartItemsSuccess,
  addToCartItemsFailure,
  updateCartItemQuantityLoadingSuccess,
  updateCartItemQuantitySuccess,
  updateCartItemQuantityFailure,
  fetchCartGroupsRequest,
  fetchCartGroupsSuccess,
  fetchCartGroupsFailure,
  deleteCartItemSuccess,
  createCartGroupRequest,
  createCartGroupFailure,
  updateDeletingCartGroupLoadingSuccess,
  deleteCartGroupSuccess,
  deleteCartGroupFailure,
  leaveCartGroupSuccess,
} = cartGroupSlide.actions;

export const joinCartGroupAction = createAction<{ roomId: string }>(
  `${SLICE_NAME}/joinCartGroupRequest`
);

export const addToCartGroupAction = createAction<{
  roomId: string;
}>(`${SLICE_NAME}/addToCartGroupRequest`);

export const updateCartItemQuantityAction = createAction<{
  id: string;
  quantity: number;
}>(`${SLICE_NAME}/updateCartItemQuantityInputRequest`);

export const deleteCartItemAction = createAction<{
  id: string;
}>(`${SLICE_NAME}/deleteCartItemActionRequest`);

export const deleteCartGroupAction = createAction<{
  roomId: string;
}>(`${SLICE_NAME}/deleteCartGroupRequest`);

export const leaveCartGroupAction = createAction<{
  roomId: string;
}>(`${SLICE_NAME}/leaveCartGroupRequest`);

export const createOrderGroupAction = createAction<{
  roomId: string;
  totalAmount: number;
}>(`${SLICE_NAME}/createOrderGroupAction`);

function* handleJoiningCartGroup() {
  while (true) {
    const {
      payload: { roomId },
    }: ReturnType<typeof joinCartGroupAction> = yield take(joinCartGroupAction);
    try {
      yield put(updateJoiningCartGroupLoading());

      const cartGroup: CartGroup = yield call(joinCartGroup, roomId);

      yield put(
        joinCartGroupSuccess({
          cartGroup: {
            ...cartGroup,
            cartItems: cartGroup.cartItems.map((it) => ({
              ...it,
              updatingQuantityLoading: false,
              deletingCartItemLoading: false,
            })),
            deletingCartGroupLoading: false,
          },
        })
      );

      yield put(updateCartGroupSelected({ roomId: cartGroup.roomId }));
      yield put(updateWindowSelected({ window: "CART_GROUP" }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(joinCartGroupFailure());
    }
  }
}

function* handleFetchingCartGroups() {
  yield take(fetchCartGroupsRequest);
  try {
    const cartGroups: Array<CartGroup> = yield call(getCartGroups);
    yield put(
      fetchCartGroupsSuccess({
        cartGroups: cartGroups.map((it) => ({
          ...it,
          cartItems: it.cartItems.map((ci) => ({
            ...ci,
            updatingQuantityLoading: false,
            deletingCartItemLoading: false,
          })),
          deletingCartGroupLoading: false,
        })),
      })
    );
  } catch (e) {
    notification.open({
      message: "Error",
      description: e.message,
      type: "error",
    });

    yield put(fetchCartGroupsFailure());
  }
}

function* handleAddingCartItem() {
  while (true) {
    const {
      payload: { roomId },
    }: ReturnType<typeof addToCartGroupAction> =
      yield take(addToCartGroupAction);
    try {
      yield put(updateAddingToCartItemsLoadingSuccess());
      const {
        productDetail,
        toppingsSelected,
        type,
        quantity,
      }: ProductState["itemsSelected"] = yield select(
        (state: RootState) => state.product.itemsSelected
      );

      yield call(
        addCartItem,
        roomId,
        { id: productDetail.id },
        toppingsSelected.map((it) => ({ id: it.id })),
        type,
        quantity
      );
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(addToCartItemsFailure());
    }
  }
}

function* updateCartItemQuantityDelay(id: string, quantity: number) {
  try {
    yield delay(500);

    //call api
    yield put(updateCartItemQuantityLoadingSuccess({ id }));
    yield call(updateCartItemQuantity, id, quantity);
  } catch (e) {
    notification.open({
      message: "Error",
      description: e.message,
      type: "error",
    });

    yield put(updateCartItemQuantityFailure({ id }));
  }
}

function* handleUpdatingCartItemQuantity() {
  let typingTask: Task | null = null;
  while (true) {
    const {
      payload: { id, quantity },
    }: ReturnType<typeof updateCartItemQuantityAction> = yield take(
      updateCartItemQuantityAction
    );

    try {
      if (typingTask) {
        yield cancel(typingTask);
        typingTask = null;
      }
      typingTask = yield fork(updateCartItemQuantityDelay, id, quantity);
      yield put(
        updateCartItemQuantitySuccess({
          id,
          quantity,
        })
      );
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(updateCartItemQuantityFailure({ id }));
    }
  }
}

function* handleDeletingCartItem() {
  while (true) {
    const {
      payload: { id },
    }: ReturnType<typeof deleteCartItemAction> =
      yield take(deleteCartItemAction);
    try {
      yield call(deleteCartItem, id);
      yield put(deleteCartItemSuccess({ id }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });
    }
  }
}

function* handleCreatingCartGroup() {
  while (true) {
    yield take(createCartGroupRequest);
    const roomTimeOutInputting: string = yield select(
      (state: RootState) => state.cartGroup.roomTimeOutInputting
    );
    try {
      const cartGroup: CartGroup = yield call(
        createCartGroup,
        roomTimeOutInputting
      );

      yield put(
        joinCartGroupSuccess({
          cartGroup: {
            ...cartGroup,
            cartItems: cartGroup.cartItems.map((it) => ({
              ...it,
              updatingQuantityLoading: false,
              deletingCartItemLoading: false,
            })),
            deletingCartGroupLoading: false,
          },
        })
      );

      yield put(updateCartGroupSelected({ roomId: cartGroup.roomId }));
      yield put(updateWindowSelected({ window: "CART_GROUP" }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(createCartGroupFailure());
    }
  }
}

function* handleDeletingCartGroup() {
  while (true) {
    const {
      payload: { roomId },
    }: ReturnType<typeof deleteCartGroupAction> = yield take(
      deleteCartGroupAction
    );
    try {
      yield put(updateDeletingCartGroupLoadingSuccess({ roomId }));
      yield call(deleteCartGroup, roomId);
      yield put(deleteCartGroupSuccess({ roomId }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(deleteCartGroupFailure({ roomId }));
    }
  }
}

function* handleLeavingCartGroup() {
  while (true) {
    const {
      payload: { roomId },
    }: ReturnType<typeof leaveCartGroupAction> =
      yield take(leaveCartGroupAction);
    try {
      yield call(leaveCartGroup, roomId);
      yield put(leaveCartGroupSuccess({ roomId }));
      yield put(updateWindowSelected({ window: "HOME" }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });
    }
  }
}

function* handleCreateOrderGroup() {
  while (true) {
    const {
      payload: { roomId, totalAmount },
    }: ReturnType<typeof createOrderGroupAction> = yield take(
      createOrderGroupAction
    );
    try {
      yield put(updateCreateLoading());

      const cartGroup: CartGroupState["cartGroupJoined"][number] = yield select(
        (state: RootState) =>
          state.cartGroup.cartGroupJoined.find((it) => it.roomId === roomId)
      );
      if (cartGroup) {
        const { shippingAddress, payment }: OrderState["form"] = yield select(
          (state: RootState) => state.order.form
        );
        const orderId: string = yield call(createOrder, {
          orderItems: cartGroup.cartItems.map((it) => ({
            user: { id: it.user && it.user.id },
            quantity: it.quantity,
            productDetail: {
              id: it.productDetail.id,
            },
            toppings: it.toppings,
            type: it.type,
          })),
          shippingAddress,
          payment,
          totalAmount,
        });

        if (payment.method === "VNPAY") {
          const vnpayUrl: string = yield call(
            createVNPayOrder,
            orderId,
            totalAmount
          );
          window.open(vnpayUrl, "_blank");
        } else {
          yield put(createOrderSuccess());
          yield put(deleteCartGroupAction({ roomId }));
        }
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

export const cartGroupSagas = [
  fork(handleJoiningCartGroup),
  fork(handleFetchingCartGroups),
  fork(handleAddingCartItem),
  fork(handleUpdatingCartItemQuantity),
  fork(handleDeletingCartItem),
  fork(handleCreatingCartGroup),
  fork(handleDeletingCartGroup),
  fork(handleLeavingCartGroup),
  fork(handleCreateOrderGroup),
];
