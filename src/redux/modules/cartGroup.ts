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
  kickUser,
  leaveCartGroup,
  updateCartItemNote,
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
import { addMessageSuccess } from "./message";

export type CartGroupState = {
  readonly isVisible: boolean;
  readonly windowSelected: "HOME" | "CART_GROUP";
  readonly cartGroupsJoined: Array<{
    readonly roomId: string;
    readonly timeout: number;
    readonly user: {
      readonly id: string;
      readonly username: string;
      readonly avatar: string;
    };
    cartItems: Array<
      Cart & {
        readonly updatingQuantityLoading?: boolean;
        readonly isUpdateNoteLoading?: boolean;
        readonly deletingCartItemLoading?: boolean;
        readonly kickingUserFromCartItemLoading?: boolean;
      }
    >;
    readonly deletingCartGroupLoading?: boolean;
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
  cartGroupsJoined: [],
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
    updateVisible: (state, action: PayloadAction<{ isVisible: boolean }>) => ({
      ...state,
      isVisible: action.payload.isVisible,
    }),
    updateWindowSelectedSuccess: (
      state,
      action: PayloadAction<{ window: "CART_GROUP" | "HOME" }>
    ) => ({
      ...state,
      windowSelected: action.payload.window,
    }),
    updateCartGroupSelectedSuccess: (
      state,
      action: PayloadAction<{ roomId: string }>
    ) => ({
      ...state,
      cartGroupSelected: action.payload.roomId,
    }),
    updateLoadingForJoiningCartGroupSuccess: (state) => ({
      ...state,
      joiningCartGroupLoading: true,
    }),
    joinCartGroupSuccess: (
      state,
      action: PayloadAction<{
        cartGroup: CartGroupState["cartGroupsJoined"][number];
      }>
    ) => ({
      ...state,
      cartGroupsJoined: [...state.cartGroupsJoined, action.payload.cartGroup],
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
    updateRoomTimeOutInputtingSuccess: (
      state,
      action: PayloadAction<{ value: string }>
    ) => ({
      ...state,
      roomTimeOutInputting: action.payload.value,
    }),
    updateLoadingForAddingToCartItemsSuccess: (state) => ({
      ...state,
      addingToCartItemLoading: true,
    }),
    addToCartItemsSuccess: (
      state,
      action: PayloadAction<{
        cartItem: CartGroupState["cartGroupsJoined"][number]["cartItems"][number];
        roomId: string;
      }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((it) => {
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
    updateLoadingForCartItemQuantitySuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((group) => ({
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
      cartGroupsJoined: state.cartGroupsJoined.map((group) => ({
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
      cartGroupsJoined: state.cartGroupsJoined.map((group) => ({
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
    updateLoadingForCartItemNoteSuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((group) => ({
        ...group,
        cartItems: group.cartItems.map((ci) => {
          if (ci.id === action.payload.id) {
            return {
              ...ci,
              isUpdateNoteLoading: true,
            };
          }
          return ci;
        }),
      })),
    }),
    updateCartItemNoteSuccess: (
      state,
      action: PayloadAction<{ id: string; note: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((group) => ({
        ...group,
        cartItems: group.cartItems.map((ci) => {
          if (ci.id === action.payload.id) {
            return {
              ...ci,
              note: action.payload.note,
              isUpdateNoteLoading: false,
            };
          }
          return ci;
        }),
      })),
    }),
    updateCartItemNoteFailure: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((group) => ({
        ...group,
        cartItems: group.cartItems.map((ci) => {
          if (ci.id === action.payload.id) {
            return {
              ...ci,
              isUpdateNoteLoading: false,
            };
          }
          return ci;
        }),
      })),
    }),
    fetchCartGroupsRequest: (state) => ({
      ...state,
      fetchingCartGroupsLoading: true,
    }),
    fetchCartGroupsSuccess: (
      state,
      action: PayloadAction<{ cartGroups: CartGroupState["cartGroupsJoined"] }>
    ) => ({
      ...state,
      cartGroupsJoined: action.payload.cartGroups,
      fetchingCartGroupsLoading: false,
    }),
    fetchCartGroupsFailure: (state) => ({
      ...state,
      fetchingCartGroupsLoading: false,
    }),
    deleteCartItemSuccess: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((group) => ({
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
    updateLoadingForDeletingCartGroupSuccess: (
      state,
      action: PayloadAction<{ roomId: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((it) => {
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
      cartGroupsJoined: state.cartGroupsJoined.filter(
        (it) => it.roomId !== action.payload.roomId
      ),
      windowSelected: "HOME",
    }),
    deleteCartGroupFailure: (
      state,
      action: PayloadAction<{ roomId: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((it) => {
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
      cartGroupsJoined: action.payload.userId
        ? state.cartGroupsJoined.map((it) => {
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
        : state.cartGroupsJoined.filter(
            (it) => it.roomId !== action.payload.roomId
          ),
    }),
    updateLoadingForKickUserSuccess: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((it) => {
        if (it.roomId === action.payload.roomId) {
          return {
            ...it,
            cartItems: it.cartItems.map((ci) => {
              if (ci.user && ci.user.id === action.payload.userId) {
                return {
                  ...ci,
                  kickingUserFromCartItemLoading: true,
                };
              }
              return ci;
            }),
          };
        }
        return it;
      }),
    }),
    kickUserSuccess: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((it) => {
        if (it.roomId === action.payload.roomId) {
          return {
            ...it,
            cartItems: it.cartItems.filter(
              (ci) => ci.user && ci.user.id !== action.payload.userId
            ),
          };
        }
        return it;
      }),
    }),
    kickUserFailure: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>
    ) => ({
      ...state,
      cartGroupsJoined: state.cartGroupsJoined.map((it) => {
        if (it.roomId === action.payload.roomId) {
          return {
            ...it,
            cartItems: it.cartItems.map((ci) => {
              if (ci.user && ci.user.id === action.payload.userId) {
                return {
                  ...ci,
                  kickingUserFromCartItemLoading: false,
                };
              }
              return ci;
            }),
          };
        }
        return it;
      }),
    }),
  },
});
export default cartGroupSlide.reducer;

export const {
  updateVisible,
  updateWindowSelectedSuccess,
  updateCartGroupSelectedSuccess,
  updateLoadingForJoiningCartGroupSuccess,
  joinCartGroupSuccess,
  joinCartGroupFailure,
  updateRoomCodeInputting,
  updateRoomTimeOutInputtingSuccess,
  updateLoadingForAddingToCartItemsSuccess,
  addToCartItemsSuccess,
  addToCartItemsFailure,
  updateLoadingForCartItemQuantitySuccess,
  updateCartItemQuantitySuccess,
  updateCartItemQuantityFailure,
  updateLoadingForCartItemNoteSuccess,
  updateCartItemNoteSuccess,
  updateCartItemNoteFailure,
  fetchCartGroupsRequest,
  fetchCartGroupsSuccess,
  fetchCartGroupsFailure,
  deleteCartItemSuccess,
  createCartGroupRequest,
  createCartGroupFailure,
  updateLoadingForDeletingCartGroupSuccess,
  deleteCartGroupSuccess,
  deleteCartGroupFailure,
  leaveCartGroupSuccess,
  updateLoadingForKickUserSuccess,
  kickUserSuccess,
  kickUserFailure,
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

export const updateCartItemNoteAction = createAction<{
  id: string;
  note: string;
}>(`${SLICE_NAME}/updateCartItemNoteInputRequest`);

export const deleteCartItemAction = createAction<{
  id: string;
}>(`${SLICE_NAME}/deleteCartItemActionRequest`);

export const deleteCartGroupAction = createAction<{
  roomId: string;
}>(`${SLICE_NAME}/deleteCartGroupRequest`);

export const leaveCartGroupAction = createAction<{
  roomId: string;
}>(`${SLICE_NAME}/leaveCartGroupRequest`);

export const kickUserAction = createAction<{
  roomId: string;
  userId: string;
}>(`${SLICE_NAME}/kickUserRequest`);

function* handleJoiningCartGroup() {
  while (true) {
    const {
      payload: { roomId },
    }: ReturnType<typeof joinCartGroupAction> = yield take(joinCartGroupAction);
    try {
      yield put(updateLoadingForJoiningCartGroupSuccess());

      const cartGroup: CartGroup = yield call(joinCartGroup, roomId);

      yield put(joinCartGroupSuccess({ cartGroup }));

      yield put(updateCartGroupSelectedSuccess({ roomId: cartGroup.roomId }));
      yield put(updateWindowSelectedSuccess({ window: "CART_GROUP" }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(joinCartGroupFailure());
    }
  }
}

function* handleFetchingCartGroups() {
  yield take(fetchCartGroupsRequest);
  try {
    const { currentUser }: { currentUser: RootState["auth"]["currentUser"] } =
      yield select((state: RootState) => state.auth);
    if (currentUser && !(currentUser.role === "RETAILER")) {
      const cartGroups: Array<CartGroup> = yield call(getCartGroups);
      yield put(fetchCartGroupsSuccess({ cartGroups }));
    } else {
      yield put(fetchCartGroupsFailure());
    }
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
      yield put(updateLoadingForAddingToCartItemsSuccess());
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
      yield put(addMessageSuccess({ error: e }));
      yield put(addToCartItemsFailure());
    }
  }
}

function* updateCartItemQuantityDelay(id: string, quantity: number) {
  yield delay(500);
  yield put(updateLoadingForCartItemQuantitySuccess({ id }));
  yield call(updateCartItemQuantity, id, quantity);
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
      yield put(addMessageSuccess({ error: e }));
      yield put(updateCartItemQuantityFailure({ id }));
    }
  }
}

function* updateCartItemNoteDelay(id: string, note: string) {
  yield delay(500);
  yield put(updateLoadingForCartItemNoteSuccess({ id }));
  yield call(updateCartItemNote, id, note);
  yield put(
    updateCartItemNoteSuccess({
      id,
      note,
    })
  );
}

function* handleUpdatingCartItemNote() {
  let typingTask: Task | null = null;
  while (true) {
    const {
      payload: { id, note },
    }: ReturnType<typeof updateCartItemNoteAction> = yield take(
      updateCartItemNoteAction
    );

    try {
      if (typingTask) {
        yield cancel(typingTask);
        typingTask = null;
      }
      typingTask = yield fork(updateCartItemNoteDelay, id, note);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateCartItemNoteFailure({ id }));
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
      yield put(addMessageSuccess({ error: e }));
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

      yield put(joinCartGroupSuccess({ cartGroup }));

      yield put(updateCartGroupSelectedSuccess({ roomId: cartGroup.roomId }));
      yield put(updateWindowSelectedSuccess({ window: "CART_GROUP" }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
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
      yield put(updateLoadingForDeletingCartGroupSuccess({ roomId }));
      yield call(deleteCartGroup, roomId);
      yield put(deleteCartGroupSuccess({ roomId }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
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
      yield put(updateWindowSelectedSuccess({ window: "HOME" }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
    }
  }
}

function* handleKickingUser() {
  while (true) {
    const {
      payload: { roomId, userId },
    }: ReturnType<typeof kickUserAction> = yield take(kickUserAction);
    try {
      yield put(updateLoadingForKickUserSuccess({ roomId, userId }));
      yield call(kickUser, roomId, userId);
      yield put(kickUserSuccess({ roomId, userId }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(kickUserFailure({ roomId, userId }));
    }
  }
}

export const cartGroupSagas = [
  fork(handleJoiningCartGroup),
  fork(handleFetchingCartGroups),
  fork(handleAddingCartItem),
  fork(handleUpdatingCartItemQuantity),
  fork(handleUpdatingCartItemNote),
  fork(handleDeletingCartItem),
  fork(handleCreatingCartGroup),
  fork(handleDeletingCartGroup),
  fork(handleLeavingCartGroup),
  fork(handleKickingUser),
];
