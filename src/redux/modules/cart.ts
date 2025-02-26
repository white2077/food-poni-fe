import { ProductState } from "@/redux/modules/product.ts";
import { RootState } from "@/redux/store.ts";
import { Cart, OrderItem, Page } from "@/type/types.ts";
import {
  createCart,
  deleteAllCart,
  deleteCart,
  getCartsPage,
  updateCartAllChecked,
  updateCartChecked,
  updateCartNote,
  updateCartQuantity,
} from "@/utils/api/cart.ts";
import { QueryParams } from "@/utils/api/common.ts";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import { Task } from "redux-saga";
import {
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  select,
  take,
} from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type CartState = {
  readonly page: Page<
    Array<
      Cart & {
        readonly isCheckedLoading?: boolean;
        readonly isUpdateQuantityLoading?: boolean;
        readonly isUpdateNoteLoading?: boolean;
        readonly isDeleteLoading?: boolean;
      }
    >
  >;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
  readonly isCheckAllLoading: boolean;
  readonly isDeleteAllLoading: boolean;
  readonly isAllChecked: boolean;
  readonly isBuyAgainLoading: boolean;
};

const initialState: CartState = {
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
  isFetchLoading: false,
  isCreateLoading: false,
  isCheckAllLoading: false,
  isDeleteAllLoading: false,
  isAllChecked: false,
  isBuyAgainLoading: false,
};

const SLICE_NAME = "cart";

const cartListSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchCartsSuccess: (
      state,
      action: PayloadAction<{ page: CartState["page"] }>
    ) => {
      const isAnyChecked = action.payload.page.content.every(
        (cart) => cart.checked
      );
      return {
        ...state,
        page: action.payload.page,
        isFetchLoading: false,
        isAllChecked: isAnyChecked,
      };
    },
    fetchCartFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateCreateLoading: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    createCartSuccess: (
      state,
      action: PayloadAction<{ cart: CartState["page"]["content"][0] }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: [action.payload.cart, ...state.page.content],
        totalElements: state.page.totalElements + 1,
      },
      isCreateLoading: false,
    }),
    createCartFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateQuantityLoadingSuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              isUpdateQuantityLoading: true,
            };
          }
          return it;
        }),
      },
    }),
    updateQuantitySuccess: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.id === action.payload.id) {
            return {
              ...cart,
              quantity: action.payload.quantity,
              isUpdateQuantityLoading: false,
            };
          }
          return cart;
        }),
      },
    }),
    updateQuantityFailure: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.id === action.payload.id) {
            return {
              ...cart,
              isUpdateQuantityLoading: false,
            };
          }
          return cart;
        }),
      },
    }),
    updateNoteLoadingSuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              isUpdateNoteLoading: true,
            };
          }
          return it;
        }),
      },
    }),
    updateNoteSuccess: (
      state,
      action: PayloadAction<{ id: string; note: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.id === action.payload.id) {
            return {
              ...cart,
              note: action.payload.note,
              isUpdateNoteLoading: false,
            };
          }
          return cart;
        }),
      },
    }),
    updateNoteFailure: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.id === action.payload.id) {
            return {
              ...cart,
              isUpdateNoteLoading: false,
            };
          }
          return cart;
        }),
      },
    }),
    updateCartCheckedLoadingSuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              isCheckedLoading: true,
            };
          }
          return it;
        }),
      },
    }),
    updateCheckedSuccess: (
      state,
      action: PayloadAction<{ id: string; checked: boolean }>
    ) => {
      const updatedContent = state.page.content.map((it) => {
        if (it.id === action.payload.id) {
          return {
            ...it,
            checked: action.payload.checked,
            isCheckedLoading: false,
          };
        }
        return it;
      });
      const isAnyChecked = updatedContent.every((it) => it.checked);
      return {
        ...state,
        page: {
          ...state.page,
          content: updatedContent,
        },
        isAllChecked: isAnyChecked,
      };
    },
    updateCheckedFailure: (state) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          return {
            ...it,
            isCheckedLoading: false,
          };
        }),
      },
    }),
    updateAllCheckedRequest: (state) => ({
      ...state,
      isCheckAllLoading: true,
    }),
    updateAllCheckedSuccess: (
      state,
      action: PayloadAction<{ checked: boolean }>
    ) => {
      const updatedContent = state.page.content.map((it) => {
        return {
          ...it,
          checked: !action.payload.checked,
        };
      });
      const isAnyChecked = updatedContent.some((it) => it.checked);
      return {
        ...state,
        page: {
          ...state.page,
          content: updatedContent,
        },
        isCheckAllLoading: false,
        isAllChecked: isAnyChecked,
      };
    },
    updateAllCheckedFailure: (state) => ({
      ...state,
      isCheckAllLoading: false,
    }),
    deleteCartRequest: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              isDeleteLoading: true,
            };
          }
          return it;
        }),
      },
    }),
    deleteCartSuccess: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content
          .map((it) => {
            if (it.id === action.payload.id) {
              return {
                ...it,
                isDeleteLoading: false,
              };
            }
            return it;
          })
          .filter((cart) => cart.id !== action.payload.id),
        totalElements: state.page.totalElements - 1,
      },
    }),
    deleteCartFailure: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              isDeleteLoading: false,
            };
          }
          return it;
        }),
      },
    }),
    deleteAllCartRequest: (state) => ({
      ...state,
      isDeleteAllLoading: true,
    }),
    deleteAllCartSuccess: () => ({
      ...initialState,
    }),
    deleteAllCartFailure: (state) => ({
      ...state,
      isDeleteAllLoading: false,
    }),
    updateBuyAgainLoading: (state) => ({
      ...state,
      isBuyAgainLoading: true,
    }),
    buyAgainSuccess: (state) => ({
      ...state,
      isBuyAgainLoading: false,
    }),
    buyAgainFailure: (state) => ({
      ...state,
      isBuyAgainLoading: false,
    }),
  },
});
export default cartListSlide.reducer;

export const {
  updateFetchLoading,
  fetchCartsSuccess,
  fetchCartFailure,
  updateCreateLoading,
  createCartSuccess,
  createCartFailure,
  updateQuantityLoadingSuccess,
  updateQuantitySuccess,
  updateQuantityFailure,
  updateNoteLoadingSuccess,
  updateNoteSuccess,
  updateNoteFailure,
  updateCartCheckedLoadingSuccess,
  updateCheckedSuccess,
  updateCheckedFailure,
  updateAllCheckedRequest,
  updateAllCheckedSuccess,
  updateAllCheckedFailure,
  updateBuyAgainLoading,
  buyAgainSuccess,
  buyAgainFailure,
  deleteCartRequest,
  deleteCartSuccess,
  deleteCartFailure,
  deleteAllCartRequest,
  deleteAllCartSuccess,
  deleteAllCartFailure,
} = cartListSlide.actions;

export const fetchCartsAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchCartsRequest`
);
export const createCartAction = createAction<{
  navigate: NavigateFunction | null;
}>(`${SLICE_NAME}/createCartRequest`);
export const buyBackCartAction = createAction<{ orderItem: OrderItem }>(
  `${SLICE_NAME}/buyBackCartRequest`
);
export const updateQuantityButtonAction = createAction<{
  type: "INCREASE" | "DECREASE";
  id: string;
}>(`${SLICE_NAME}/updateQuantityButtonRequest`);
export const updateQuantityInputAction = createAction<{
  id: string;
  quantity: number;
}>(`${SLICE_NAME}/updateQuantityInputRequest`);
export const updateNoteAction = createAction<{
  id: string;
  note: string;
}>(`${SLICE_NAME}/updateNoteRequest`);
export const updateCheckedAction = createAction<{
  id: string;
  checked: boolean;
}>(`${SLICE_NAME}/updateCheckedRequest`);
export const buyAgainOrderAction = createAction<{ orderItems: OrderItem[] }>(
  `${SLICE_NAME}/buyAgainOrderRequest`
);

function* handleFetchCart() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchCartsAction> = yield take(fetchCartsAction);
    try {
      yield put(updateFetchLoading());
      const page: Page<Cart[]> = yield call(getCartsPage, queryParams);
      yield put(
        fetchCartsSuccess({
          page,
        })
      );
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchCartFailure());
    }
  }
}

function* handleCreateCart() {
  while (true) {
    const {
      payload: { navigate },
    }: ReturnType<typeof createCartAction> = yield take(createCartAction);
    try {
      yield put(updateCreateLoading());
      const {
        productDetail,
        toppingsSelected,
        type,
        quantity,
      }: ProductState["itemsSelected"] = yield select(
        (state: RootState) => state.product.itemsSelected
      );
      const { product }: ProductState["productSelected"] = yield select(
        (state: RootState) => state.product.productSelected
      );

      const { id }: { id: string } = yield call(
        createCart,
        quantity,
        productDetail.id,
        toppingsSelected.map((it) => it.id),
        type
      );
      const cart = {
        id,
        quantity,
        productName: product.name + " - " + productDetail.name,
        productDetail: {
          id: productDetail.id,
          name: productDetail.name,
          price: productDetail.price,
          images: productDetail.images,
        },
        toppings: toppingsSelected,
        type: type,
        checked: true,
        isUpdateLoading: false,
        isDeleteLoading: false,
      };
      yield put(createCartSuccess({ cart }));
      if (navigate) {
        navigate("/checkout");
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(createCartFailure());
    }
  }
}

function* handleBuyBackCart() {
  while (true) {
    const {
      payload: { orderItem },
    }: ReturnType<typeof buyBackCartAction> = yield take(buyBackCartAction);
    try {
      yield put(updateCreateLoading());
      const { productDetail, toppings, type, quantity } = orderItem;

      const { id }: { id: string } = yield call(
        createCart,
        quantity,
        productDetail.id,
        toppings.map((it) => it.id),
        type
      );
      const cart = {
        id,
        quantity,
        productName: productDetail.product.name + " - " + productDetail.name,
        productDetail: {
          id: productDetail.id,
          name: productDetail.name,
          price: productDetail.price,
          images: productDetail.images,
        },
        toppings: toppings,
        type: type,
        checked: true,
        isUpdateLoading: false,
        isDeleteLoading: false,
      };
      yield put(createCartSuccess({ cart }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(createCartFailure());
    }
  }
}

function* delayUpdateQuantityCart(id: string, quantity: number) {
  yield put(
    updateQuantitySuccess({
      id,
      quantity,
    })
  );
  yield delay(500);
  yield put(updateQuantityLoadingSuccess({ id }));
  yield call(updateCartQuantity, id, quantity);
  yield put(
    updateQuantitySuccess({
      id,
      quantity,
    })
  );
}

function* handleUpdateQuantityCart() {
  const typingTasks: Map<string, Task> = new Map();
  while (true) {
    const {
      updateQuantityButton,
      updateQuantityInput,
    }: {
      updateQuantityButton: ReturnType<typeof updateQuantityButtonAction>;
      updateQuantityInput: ReturnType<typeof updateQuantityInputAction>;
    } = yield race({
      updateQuantityButton: take(updateQuantityButtonAction),
      updateQuantityInput: take(updateQuantityInputAction),
    });

    try {
      if (updateQuantityButton) {
        const { type, id } = updateQuantityButton.payload;
        const content: CartState["page"]["content"] = yield select(
          (state: RootState) => state.cart.page.content
        );
        const cart = content.find((it) => it.id === id);

        const task = typingTasks.get(id);
        if (task) {
          yield cancel(task);
          typingTasks.delete(id);
        }

        if (cart) {
          if (type === "DECREASE") {
            typingTasks.set(
              id,
              yield fork(delayUpdateQuantityCart, id, cart.quantity - 1)
            );
          }

          if (type === "INCREASE") {
            typingTasks.set(
              id,
              yield fork(delayUpdateQuantityCart, id, cart.quantity + 1)
            );
          }
        }
      }
      if (updateQuantityInput) {
        const { id, quantity } = updateQuantityInput.payload;
        const task = typingTasks.get(id);
        if (task) {
          yield cancel(task);
          typingTasks.delete(id);
        }
        typingTasks.set(id, yield fork(delayUpdateQuantityCart, id, quantity));
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));

      if (updateQuantityInput) {
        const id = updateQuantityInput.payload.id;
        yield put(updateQuantityFailure({ id }));
      }
      if (updateQuantityButton) {
        const id = updateQuantityInput.payload.id;
        yield put(updateQuantityFailure({ id }));
      }
    }
  }
}

function* delayUpdateNoteCart(id: string, note: string) {
  yield delay(500);
  yield put(updateNoteLoadingSuccess({ id }));
  yield call(updateCartNote, id, note);
  yield put(
    updateNoteSuccess({
      id,
      note,
    })
  );
}

function* handleUpdateNoteCart() {
  const typingTasks: Map<string, Task> = new Map();
  while (true) {
    const {
      payload: { id, note },
    }: ReturnType<typeof updateNoteAction> = yield take(updateNoteAction);

    try {
      const task = typingTasks.get(id);
      if (task) {
        yield cancel(task);
        typingTasks.delete(id);
      }
      typingTasks.set(id, yield fork(delayUpdateNoteCart, id, note));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateNoteFailure({ id }));
    }
  }
}

function* updateCheckCart(id: string, checked: boolean) {
  yield call(updateCartChecked, {
    id,
    checked,
  });
  yield put(updateCheckedSuccess({ id, checked }));
}

function* handleUpdateCheckedCart() {
  while (true) {
    const {
      payload: { id, checked },
    }: ReturnType<typeof updateCheckedAction> = yield take(updateCheckedAction);
    try {
      yield put(updateCartCheckedLoadingSuccess({ id }));
      yield fork(updateCheckCart, id, checked);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateCheckedFailure());
    }
  }
}

function* handleUpdateAllCheckedCart() {
  while (true) {
    yield take(updateAllCheckedRequest);
    try {
      yield call(updateCartAllChecked);
      const isAnyChecked: CartState["isAllChecked"] = yield select(
        (state: RootState) =>
          state.cart.page.content.every((cart) => cart.checked)
      );
      yield put(updateAllCheckedSuccess({ checked: isAnyChecked }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateAllCheckedFailure());
    }
  }
}

function* handleDeleteCart() {
  while (true) {
    const {
      payload: { id },
    }: ReturnType<typeof deleteCartRequest> = yield take(deleteCartRequest);
    try {
      yield call(deleteCart, id);
      yield put(deleteCartSuccess({ id }));

      const isAnyChecked: CartState["isAllChecked"] = yield select(
        (state: RootState) =>
          state.cart.page.content.every((cart) => cart.checked)
      );
      yield put(updateAllCheckedSuccess({ checked: !isAnyChecked }));

    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(deleteCartFailure({ id }));
    }
  }
}

function* handleDeleteAllCart() {
  while (true) {
    yield take(deleteAllCartRequest);
    try {
      yield call(deleteAllCart);
      yield put(deleteAllCartSuccess());
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(deleteAllCartFailure());
    }
  }
}

function* handleBuyAgainOrder() {
  while (true) {
    const {
      payload: { orderItems },
    }: ReturnType<typeof buyAgainOrderAction> = yield take(buyAgainOrderAction);
    try {
      yield put(updateBuyAgainLoading());

      const cartItemsToAdd = orderItems.map((item) => ({
        productDetailId: item.productDetail.id,
        quantity: item.quantity,
        toppings: item.toppings || [],
        type: item.type,
      }));

      console.log("cartItemsToAdd", cartItemsToAdd);

      yield put(buyAgainSuccess());
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(buyAgainFailure());
    }
  }
}

export const cartSagas = [
  fork(handleFetchCart),
  fork(handleCreateCart),
  fork(handleBuyBackCart),
  fork(handleUpdateQuantityCart),
  fork(handleUpdateNoteCart),
  fork(handleUpdateCheckedCart),
  fork(handleUpdateAllCheckedCart),
  fork(handleDeleteCart),
  fork(handleDeleteAllCart),
  fork(handleBuyAgainOrder),
];
