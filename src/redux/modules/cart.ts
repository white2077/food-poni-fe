import { createSlice } from "@reduxjs/toolkit";
import { Page } from "@/type/types.ts";
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

export type CartState = {
  readonly page: Page<
    {
      readonly quantity: number;
      readonly productName: string;
      readonly productDetail: {
        readonly id: string;
        readonly name: string;
        readonly price: number;
        readonly images: string[];
      };
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
        checked: true,
        isUpdateLoading: false,
        isDeleteLoading: false,
      },
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
    fetchCartRequest: (
      state,
      { payload }: { payload: string | undefined },
    ) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchCartSuccess: (
      state,
      {
        payload,
      }: {
        payload: Page<
          {
            readonly quantity: number;
            readonly productName: string;
            readonly productDetail: {
              readonly id: string;
              readonly name: string;
              readonly price: number;
              readonly images: string[];
            };
            readonly checked: boolean;
            readonly isUpdateLoading: boolean;
            readonly isDeleteLoading: boolean;
          }[]
        >;
      },
    ) => {
      const isAnyChecked = payload.content.every((cart) => cart.checked);
      return {
        ...state,
        page: payload,
        isFetchLoading: false,
        isAllChecked: isAnyChecked,
      };
    },
    fetchCartFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    createCartRequest: (
      state,
      {
        payload,
      }: {
        payload: {
          quantity: number;
          productDetail: string;
          productName: string;
          productDetailName: string;
          price: number;
          thumbnail: string;
        };
      },
    ) => ({
      ...state,
      isCreateLoading: true,
    }),
    createCartSuccess: (
      state,
      {
        payload,
      }: {
        payload: {
          quantity: number;
          productName: string;
          productDetail: {
            id: string;
            name: string;
            price: number;
            images: string[];
          };
          checked: boolean;
          isUpdateLoading: boolean;
          isDeleteLoading: boolean;
        };
      },
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: [payload, ...state.page.content],
        totalElements: state.page.totalElements + 1,
      },
      isCreateLoading: false,
    }),
    createCartFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateDecreaseQuantityRequest: (
      state,
      { payload }: { payload: { pdid: string } },
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.productDetail.id === payload.pdid) {
            return {
              ...cart,
              isUpdateLoading: true,
            };
          }
          return cart;
        }),
      },
    }),
    updateIncreaseQuantityRequest: (
      state,
      { payload }: { payload: { pdid: string } },
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.productDetail.id === payload.pdid) {
            return {
              ...cart,
              isUpdateLoading: true,
            };
          }
          return cart;
        }),
      },
    }),
    updateQuantityRequest: (
      state,
      { payload }: { payload: { pdid: string; quantity: number } },
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.productDetail.id === payload.pdid) {
            return {
              ...cart,
              isUpdateLoading: true,
            };
          }
          return cart;
        }),
      },
    }),
    updateQuantitySuccess: (
      state,
      { payload }: { payload: { pdid: string; quantity: number } },
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.productDetail.id === payload.pdid) {
            return {
              ...cart,
              quantity: payload.quantity,
              isUpdateLoading: false,
            };
          }
          return cart;
        }),
      },
    }),
    updateQuantityFailure: (state, { payload }: { payload: string }) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.productDetail.id === payload) {
            return {
              ...cart,
              isUpdateLoading: false,
            };
          }
          return cart;
        }),
      },
    }),
    updateCheckedRequest: (
      state,
      { payload }: { payload: { pdid: string; checked: boolean } },
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.productDetail.id === payload.pdid) {
            return {
              ...cart,
              isUpdateLoading: true,
            };
          }
          return cart;
        }),
      },
    }),
    updateCheckedSuccess: (
      state,
      { payload }: { payload: { pdid: string; checked: boolean } },
    ) => {
      const updatedContent = state.page.content.map((cart) => {
        if (cart.productDetail.id === payload.pdid) {
          return {
            ...cart,
            checked: payload.checked,
            isUpdateLoading: false,
          };
        }
        return cart;
      });
      const isAnyChecked = updatedContent.every((cart) => cart.checked);
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
        content: state.page.content.map((cart) => {
          return {
            ...cart,
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
      { payload }: { payload: { checked: boolean } },
    ) => {
      const updatedContent = state.page.content.map((cart) => {
        return {
          ...cart,
          checked: !payload.checked,
        };
      });
      const isAnyChecked = updatedContent.some((cart) => cart.checked);
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
    deleteCartRequest: (state, { payload }: { payload: string }) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.productDetail.id === payload) {
            return {
              ...cart,
              isDeleteLoading: true,
            };
          }
          return cart;
        }),
      },
    }),
    deleteCartSuccess: (state, { payload }: { payload: string }) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content
          .map((cart) => {
            if (cart.productDetail.id === payload) {
              return {
                ...cart,
                isDeleteLoading: false,
              };
            }
            return cart;
          })
          .filter((cart) => cart.productDetail.id !== payload),
        totalElements: state.page.totalElements - 1,
      },
    }),
    deleteCartFailure: (state, { payload }: { payload: string }) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((cart) => {
          if (cart.productDetail.id === payload) {
            return {
              ...cart,
              isDeleteLoading: false,
            };
          }
          return cart;
        }),
      },
    }),
    deleteAllCartRequest: (state) => ({
      ...state,
      isDeleteAllLoading: true,
    }),
    deleteAllCartSuccess: (state) => ({
      ...state,
      page: {
        ...state.page,
        content: [],
        totalElements: 0,
      },
      isDeleteAllLoading: false,
    }),
    deleteAllCartFailure: (state) => ({
      ...state,
      isDeleteAllLoading: false,
    }),
  },
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
  deleteAllCartFailure,
} = cartListSlide.actions;

function* handleFetchCart() {
  while (true) {
    const { payload }: ReturnType<typeof fetchCartRequest> = yield take(
      fetchCartRequest.type,
    );
    try {
      const queryParams: QueryParams = {
        pageSize: 10,
        page: 0,
        status: true,
      };

      queryParams.sort = payload;
      const page: Page<
        {
          readonly quantity: number;
          readonly productName: string;
          readonly productDetail: {
            readonly id: string;
            readonly name: string;
            readonly price: number;
            readonly images: string[];
          };
          readonly checked: boolean;
          readonly isUpdateLoading: boolean;
          readonly isDeleteLoading: boolean;
        }[]
      > = yield call(getCartsPage, queryParams);
      yield put(fetchCartSuccess(page));
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
    const { payload }: ReturnType<typeof createCartRequest> = yield take(
      createCartRequest.type,
    );
    try {
      yield call(createCart, {
        quantity: payload.quantity,
        productDetail: payload.productDetail,
      });
      const cart: {
        readonly quantity: number;
        readonly productName: string;
        readonly productDetail: {
          readonly id: string;
          readonly name: string;
          readonly price: number;
          readonly images: string[];
        };
        readonly checked: boolean;
        readonly isUpdateLoading: boolean;
        readonly isDeleteLoading: boolean;
      } = {
        quantity: payload.quantity,
        productName: payload.productName + " - " + payload.productDetailName,
        productDetail: {
          id: payload.productDetail,
          name: payload.productDetailName,
          price: payload.price,
          images: [payload.thumbnail],
        },
        checked: true,
        isUpdateLoading: false,
        isDeleteLoading: false,
      };
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
    quantity: quantity,
  });
}

function* handleUpdateQuantityCart() {
  let task: Task | null = null;
  while (true) {
    const {
      updateDecreaseQuantity,
      updateIncreaseQuantity,
      updateQuantity,
    }: {
      updateDecreaseQuantity: ReturnType<typeof updateDecreaseQuantityRequest>;
      updateIncreaseQuantity: ReturnType<typeof updateIncreaseQuantityRequest>;
      updateQuantity: ReturnType<typeof updateQuantityRequest>;
    } = yield race({
      updateDecreaseQuantity: take(updateDecreaseQuantityRequest.type),
      updateIncreaseQuantity: take(updateIncreaseQuantityRequest.type),
      updateQuantity: take(updateQuantityRequest.type),
    });
    try {
      if (updateDecreaseQuantity) {
        const { quantity } = yield select((state: RootState) =>
          state.cart.page.content.find(
            (cart) =>
              cart.productDetail.id === updateDecreaseQuantity.payload.pdid,
          ),
        );
        yield call(updateCartQuantity, {
          pdid: updateDecreaseQuantity.payload.pdid,
          quantity: quantity - 1,
        });

        yield put(
          updateQuantitySuccess({
            pdid: updateDecreaseQuantity.payload.pdid,
            quantity: quantity - 1,
          }),
        );
      }
      if (updateIncreaseQuantity) {
        const { quantity } = yield select((state: RootState) =>
          state.cart.page.content.find(
            (cart) =>
              cart.productDetail.id === updateIncreaseQuantity.payload.pdid,
          ),
        );
        yield call(updateCartQuantity, {
          pdid: updateIncreaseQuantity.payload.pdid,
          quantity: quantity + 1,
        });

        yield put(
          updateQuantitySuccess({
            pdid: updateIncreaseQuantity.payload.pdid,
            quantity: quantity + 1,
          }),
        );
      }
      if (updateQuantity) {
        if (task) {
          yield cancel(task);
          task = null;
        }
        task = yield fork(
          handleDelay,
          updateQuantity.payload.pdid,
          updateQuantity.payload.quantity,
        );
        yield put(
          updateQuantitySuccess({
            pdid: updateQuantity.payload.pdid,
            quantity: updateQuantity.payload.quantity,
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
      if (updateDecreaseQuantity) {
        yield put(updateQuantityFailure(updateDecreaseQuantity.payload.pdid));
      }
      if (updateIncreaseQuantity) {
        yield put(updateQuantityFailure(updateIncreaseQuantity.payload.pdid));
      }
      if (updateQuantity) {
        yield put(updateQuantityFailure(updateQuantity.payload.pdid));
      }
    }
  }
}

function* handleUpdateCheckedCart() {
  while (true) {
    const { payload }: ReturnType<typeof updateCheckedRequest> = yield take(
      updateCheckedRequest.type,
    );
    try {
      yield call(updateCartChecked, {
        pdid: payload.pdid,
        checked: payload.checked,
      });
      yield put(
        updateCheckedSuccess({ pdid: payload.pdid, checked: payload.checked }),
      );
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
    yield take(updateAllCheckedRequest.type);
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
    const { payload }: ReturnType<typeof deleteCartRequest> = yield take(
      deleteCartRequest.type,
    );
    try {
      yield call(deleteCart, payload);
      yield put(deleteCartSuccess(payload));

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
  fork(handleUpdateQuantityCart),
  fork(handleUpdateCheckedCart),
  fork(handleUpdateAllCheckedCart),
  fork(handleDeleteCart),
  fork(handleDeleteAllCart),
];
