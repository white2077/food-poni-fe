import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart, OrderItem, Page } from "@/type/types.ts";
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
import { notification } from "antd";
import { QueryParams } from "@/utils/api/common.ts";
import {
  createCart,
  deleteAllCart,
  deleteCart,
  getCartsPage,
  updateCartAllChecked,
  updateCartChecked,
  updateCartQuantity,
} from "@/utils/api/cart.ts";
import { RootState } from "@/redux/store.ts";
import { Task } from "redux-saga";
import { updateOrderItemsAction } from "@/redux/modules/order.ts";
import { ProductState } from "@/redux/modules/product.ts";

export type CartState = {
  readonly page: Page<
    {
      readonly id: string;
      readonly quantity: number;
      readonly productName: string;
      readonly productDetail: {
        readonly id: string;
        readonly name: string;
        readonly price: number;
        readonly images: string[];
      };
      readonly toppings: Array<{
        readonly id: string;
        readonly name: string;
        readonly price: number;
      }>;
      readonly type: string | null;
      readonly checked: boolean;
      readonly isUpdateLoading: boolean;
      readonly isDeleteLoading: boolean;
    }[]
  >;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
  readonly isUpdateAllLoading: boolean;
  readonly isDeleteAllLoading: boolean;
  readonly isAllChecked: boolean;
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
  isUpdateAllLoading: false,
  isDeleteAllLoading: false,
  isAllChecked: false,
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
      action: PayloadAction<{ page: CartState["page"] }>,
    ) => {
      const isAnyChecked = action.payload.page.content.every(
        (cart) => cart.checked,
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
      action: PayloadAction<{ cart: CartState["page"]["content"][0] }>,
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
      action: PayloadAction<{ id: string }>,
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
              isUpdateLoading: true,
            };
          }
          return it;
        }),
      },
    }),
    updateQuantitySuccess: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.id === action.payload.id) {
            return {
              ...cart,
              quantity: action.payload.quantity,
              isUpdateLoading: false,
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
              isUpdateLoading: false,
            };
          }
          return cart;
        }),
      },
    }),
    updateCartCheckedLoadingSuccess: (
      state,
      action: PayloadAction<{ id: string }>,
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.id) {
            return {
              ...it,
            };
          }
          return it;
        }),
      },
    }),
    updateCheckedSuccess: (
      state,
      action: PayloadAction<{ id: string; checked: boolean }>,
    ) => {
      const updatedContent = state.page.content.map((it) => {
        if (it.id === action.payload.id) {
          return {
            ...it,
            checked: action.payload.checked,
            isUpdateLoading: false,
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
            isUpdateLoading: false,
          };
        }),
      },
    }),
    updateAllCheckedRequest: (state) => ({
      ...state,
      isUpdateAllLoading: true,
    }),
    updateAllCheckedSuccess: (
      state,
      action: PayloadAction<{ checked: boolean }>,
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
        isUpdateAllLoading: false,
        isAllChecked: isAnyChecked,
      };
    },
    updateAllCheckedFailure: (state) => ({
      ...state,
      isUpdateAllLoading: false,
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
  updateCartCheckedLoadingSuccess,
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
  deleteAllCartFailure,
} = cartListSlide.actions;

export const fetchCartsAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchCartsRequest`,
);
export const createCartAction = createAction<void>(
  `${SLICE_NAME}/createCartRequest`,
);
export const buyBackCartAction = createAction<{ orderItem: OrderItem }>(
  `${SLICE_NAME}/buyBackCartRequest`,
);
export const updateQuantityButtonAction = createAction<{
  type: "INCREASE" | "DECREASE";
  id: string;
}>(`${SLICE_NAME}/updateQuantityButtonRequest`);
export const updateQuantityInputAction = createAction<{
  id: string;
  quantity: number;
}>(`${SLICE_NAME}/updateQuantityInputRequest`);
export const updateCheckedAction = createAction<{
  id: string;
  checked: boolean;
}>(`${SLICE_NAME}/updateCheckedRequest`);

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
          page: {
            content: page.content.map((it) => ({
              id: it.id,
              quantity: it.quantity,
              productName: it.productName,
              productDetail: {
                id: it.productDetail.id,
                name: it.productDetail.name,
                price: it.productDetail.price,
                images: it.productDetail.images,
              },
              toppings: it.toppings,
              type: it.type,
              checked: it.checked,
              isUpdateLoading: false,
              isDeleteLoading: false,
            })),
            totalElements: page.totalElements,
            totalPages: page.totalPages,
            size: page.size,
            number: page.number,
            first: page.first,
            last: page.last,
            numberOfElements: page.numberOfElements,
            empty: page.empty,
          },
        }),
      );
      yield put(updateOrderItemsAction());
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
    yield take(createCartAction);
    try {
      yield put(updateCreateLoading());
      const {
        productDetail,
        toppingsSelected,
        type,
        quantity,
      }: ProductState["itemsSelected"] = yield select(
        (state: RootState) => state.product.itemsSelected,
      );
      const { product }: ProductState["productSelected"] = yield select(
        (state: RootState) => state.product.productSelected,
      );

      const { id }: { id: string } = yield call(
        createCart,
        quantity,
        productDetail.id,
        toppingsSelected,
        type,
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
        toppings,
        type,
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
  yield call(updateCartQuantity, pdid, quantity);
}

function* handleUpdateQuantityCart() {
  let typingTask: Task | null = null;
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
          (state: RootState) => state.cart.page.content,
        );
        const cart = content.find((it) => it.id === id);

        if (cart) {
          if (type === "DECREASE") {
            yield put(updateQuantityLoadingSuccess({ id }));
            yield call(updateCartQuantity, id, cart.quantity - 1);

            yield put(
              updateQuantitySuccess({
                id,
                quantity: cart.quantity - 1,
              }),
            );
          }

          if (type === "INCREASE") {
            yield put(updateQuantityLoadingSuccess({ id }));
            yield call(updateCartQuantity, id, cart.quantity + 1);

            yield put(
              updateQuantitySuccess({
                id,
                quantity: cart.quantity + 1,
              }),
            );
          }
        }
      }
      if (updateQuantityInput) {
        const { id, quantity } = updateQuantityInput.payload;
        if (typingTask) {
          yield cancel(typingTask);
          typingTask = null;
        }
        typingTask = yield fork(handleDelay, id, quantity);
        yield put(
          updateQuantitySuccess({
            id,
            quantity,
          }),
        );
      }
      yield put(updateOrderItemsAction());
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

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

function* handleUpdateCheckedCart() {
  while (true) {
    const {
      payload: { id, checked },
    }: ReturnType<typeof updateCheckedAction> = yield take(updateCheckedAction);
    try {
      yield put(updateCartCheckedLoadingSuccess({ id }));
      yield call(updateCartChecked, {
        id,
        checked,
      });
      yield put(updateCheckedSuccess({ id, checked }));
      yield put(updateOrderItemsAction());
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
    yield take(updateAllCheckedRequest);
    try {
      yield call(updateCartAllChecked);
      const isAnyChecked: boolean = yield select((state: RootState) =>
        state.cart.page.content.every((cart) => cart.checked),
      );
      yield put(updateAllCheckedSuccess({ checked: isAnyChecked }));
      yield put(updateOrderItemsAction());
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
    const {
      payload: { id },
    }: ReturnType<typeof deleteCartRequest> = yield take(deleteCartRequest);
    try {
      yield call(deleteCart, id);
      yield put(deleteCartSuccess({ id }));

      const isAnyChecked: boolean = yield select((state: RootState) =>
        state.cart.page.content.every((cart) => cart.checked),
      );
      yield put(updateAllCheckedSuccess({ checked: !isAnyChecked }));

      yield put(updateOrderItemsAction());
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

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
      yield put(updateOrderItemsAction());
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
  fork(handleBuyBackCart),
  fork(handleUpdateQuantityCart),
  fork(handleUpdateCheckedCart),
  fork(handleUpdateAllCheckedCart),
  fork(handleDeleteCart),
  fork(handleDeleteAllCart),
];
