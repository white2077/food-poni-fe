import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Page,
  Product,
  ProductDetail,
  ProductRatePercent,
} from "@/type/types.ts";
import { call, fork, put, race, take } from "redux-saga/effects";
import {
  getProductByIdOrSlug,
  getProductsPage,
  getProductsPageByCategory,
} from "@/utils/api/product.ts";
import { notification } from "antd";
import { QueryParams } from "@/utils/api/common.ts";
import {
  getProductDetailsByProductId,
  getProductRatePercent,
} from "@/utils/api/productDetail.ts";

export type ProductState = {
  readonly page: Page<Product[]>;
  readonly isFetchLoading: boolean;
  readonly productSelected: {
    readonly product: Product;
    readonly productDetails: ProductDetail[];
  };
  readonly itemsSelected: {
    readonly productDetail: ProductDetail;
    readonly toppingsSelected: Array<{
      readonly id: string;
      readonly name: string;
      readonly price: number;
    }>;
    readonly type: string | null;
    readonly quantity: number;
  };
  readonly ratePercents: ProductRatePercent[];
};

const initialState: ProductState = {
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
  productSelected: {
    product: {} as Product,
    productDetails: [],
  },
  itemsSelected: {
    productDetail: {} as ProductDetail,
    toppingsSelected: [],
    type: null,
    quantity: 1,
  },
  ratePercents: [],
};

const SLICE_NAME = "product";

const productSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchProductsSuccess: (
      state,
      action: PayloadAction<{ page: Page<Product[]> }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchProductsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    fetchProductSuccess: (
      state,
      action: PayloadAction<{ product: Product }>
    ) => ({
      ...state,
      productSelected: {
        ...state.productSelected,
        product: action.payload.product,
      },
      itemsSelected: {
        ...state.itemsSelected,
        type:
          action.payload.product.types.length > 0
            ? action.payload.product.types[0]
            : null,
      },
    }),
    fetchProductFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    fetchProductDetailsSuccess: (
      state,
      { payload }: { payload: ProductDetail[] }
    ) => ({
      ...state,
      productSelected: {
        ...state.productSelected,
        productDetails: payload,
      },
    }),
    updateProductDetailSelectedSuccess: (
      state,
      action: PayloadAction<{ productDetail: ProductDetail }>
    ) => ({
      ...state,
      itemsSelected: {
        ...state.itemsSelected,
        productDetail: action.payload.productDetail,
      },
    }),
    updateTypeSelectedSuccess: (
      state,
      action: PayloadAction<{ type: string }>
    ) => ({
      ...state,
      itemsSelected: {
        ...state.itemsSelected,
        type: action.payload.type,
      },
    }),
    updateToppingsSelectedSuccess: (
      state,
      action: PayloadAction<{
        topping: ProductState["itemsSelected"]["toppingsSelected"][0];
      }>
    ) => {
      const check = state.itemsSelected.toppingsSelected.some(
        (it) => it.id === action.payload.topping.id
      );
      if (check) {
        return {
          ...state,
          itemsSelected: {
            ...state.itemsSelected,
            toppingsSelected: state.itemsSelected.toppingsSelected
              .filter((it) => it.id !== action.payload.topping.id)
              .sort((a, b) => a.id.localeCompare(b.id)),
          },
        };
      }

      return {
        ...state,
        itemsSelected: {
          ...state.itemsSelected,
          toppingsSelected: [
            ...state.itemsSelected.toppingsSelected,
            action.payload.topping,
          ].sort((a, b) => a.id.localeCompare(b.id)),
        },
      };
    },
    updateProductSelectedQuantitySuccess: (
      state,
      action: PayloadAction<{ quantity: number }>
    ) => ({
      ...state,
      itemsSelected: {
        ...state.itemsSelected,
        quantity: action.payload.quantity,
      },
    }),
    fetchProductRatePercentSuccess: (
      state,
      action: PayloadAction<{ ratePercents: ProductRatePercent[] }>
    ) => ({
      ...state,
      ratePercents: action.payload.ratePercents,
    }),
    fetchProductRatePercentFailure: (state) => ({
      ...state,
      ratePercents: [],
    }),
  },
});
export default productSlide.reducer;

export const {
  updateFetchLoadingSuccess,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductSuccess,
  fetchProductFailure,
  fetchProductDetailsSuccess,
  updateProductDetailSelectedSuccess,
  updateTypeSelectedSuccess,
  updateToppingsSelectedSuccess,
  updateProductSelectedQuantitySuccess,
  fetchProductRatePercentSuccess,
  fetchProductRatePercentFailure,
} = productSlide.actions;

export const fetchProductAction = createAction<{ pathVariable: string }>(
  `${SLICE_NAME}/fetchProductRequest`
);
export const fetchProductsAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchProductsRequest`
);
export const fetchProductsByProductCategoryAction = createAction<{
  pathVariable: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchProductsByCategoryProductRequest`);
export const fetchProductRatePercentAction = createAction<{ pdid: string }>(
  `${SLICE_NAME}/fetchProductRatePercentRequest`
);

function* handleFetchProducts() {
  while (true) {
    const {
      fetchProducts,
      fetchProductsByProductCategory,
    }: {
      fetchProducts: ReturnType<typeof fetchProductsAction>;
      fetchProductsByProductCategory: ReturnType<
        typeof fetchProductsByProductCategoryAction
      >;
    } = yield race({
      fetchProducts: take(fetchProductsAction),
      fetchProductsByProductCategory: take(
        fetchProductsByProductCategoryAction
      ),
    });
    try {
      yield put(updateFetchLoadingSuccess());
      if (fetchProducts) {
        const page: Page<Product[]> = yield call(
          getProductsPage,
          fetchProducts.payload.queryParams
        );
        yield put(fetchProductsSuccess({ page }));
      }

      if (fetchProductsByProductCategory) {
        const page: Page<Product[]> = yield call(
          getProductsPageByCategory,
          fetchProductsByProductCategory.payload.pathVariable,
          fetchProductsByProductCategory.payload.queryParams
        );
        yield put(fetchProductsSuccess({ page }));
      }
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(fetchProductsFailure());
    }
  }
}

function* handleFetchProduct() {
  while (true) {
    const {
      payload: { pathVariable },
    }: ReturnType<typeof fetchProductAction> = yield take(fetchProductAction);
    try {
      const product: Product = yield call(getProductByIdOrSlug, pathVariable);
      yield fork(handleFetchProductDetails, product.id);
      yield put(fetchProductSuccess({ product }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });

      yield put(fetchProductFailure());
    }
  }
}

function* handleFetchProductDetails(pid: string) {
  try {
    const { content }: Page<ProductDetail[]> = yield call(
      getProductDetailsByProductId,
      pid
    );
    yield put(fetchProductDetailsSuccess(content));
    yield put(
      updateProductDetailSelectedSuccess({ productDetail: content[0] })
    );
  } catch (e) {
    notification.open({
      message: "Error",
      description: e.message,
      type: "error",
    });

    yield put(fetchProductsFailure());
  }
}

function* handleFetchProductRatePercent() {
  while (true) {
    const {
      payload: { pdid },
    }: ReturnType<typeof fetchProductRatePercentAction> = yield take(
      fetchProductRatePercentAction
    );
    try {
      const ratePercents: ProductRatePercent[] = yield call(
        getProductRatePercent,
        pdid
      );
      yield put(fetchProductRatePercentSuccess({ ratePercents }));
    } catch (e) {
      notification.open({
        message: "Error",
        description: e.message,
        type: "error",
      });
      yield put(fetchProductRatePercentFailure());
    }
  }
}

export const productSagas = [
  fork(handleFetchProducts),
  fork(handleFetchProduct),
  fork(handleFetchProductRatePercent),
];
