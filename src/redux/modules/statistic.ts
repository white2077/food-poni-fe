import {
  Product,
  ProductCategory,
  ProductDetail,
  StatisticReviews,
  StatisticSales,
  StatisticStatus,
} from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import {
  getStatisticPopularCategories,
  getStatisticPopularProduct,
  getStatisticPopularProductDetailer,
  getStatisticReviews,
  getStatisticSalesOverall,
  getStatisticSalesPostpaid,
  getStatisticSalesTotal,
  getStatisticSalesTotalOrder,
  getStatisticSalesTotalUser,
  getStatisticStatus,
} from "@/utils/api/statistic";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type StatisticState = {
  readonly status: StatisticStatus;
  readonly sales: StatisticSales;
  readonly totalAmount: number;
  readonly totalUser: number;
  readonly popularProducts: Product[];
  readonly popularProductsDetialer: ProductDetail[];
  readonly popularCategories: ProductCategory[];
  readonly isFetchLoading: boolean;
  readonly isSalesLoading: boolean;
  readonly isStatusOrderLoading: boolean;
  readonly isPopularProductLoading: boolean;
  readonly isProductsDetialerLoading: boolean;
  readonly isPopularCategoriesLoading: boolean;
  readonly reviews: StatisticReviews;
  readonly totalOrder: number;
  readonly totalPostpaid: number;
};

const initialState: StatisticState = {
  status: {} as StatisticStatus,
  sales: {} as StatisticSales,
  reviews: {} as StatisticReviews,
  totalAmount: 0,
  totalPostpaid: 0,
  totalUser: 0,
  totalOrder: 0,
  popularProducts: [],
  popularProductsDetialer: [],
  popularCategories: [],
  isFetchLoading: false,
  isSalesLoading: false,
  isStatusOrderLoading: false,
  isPopularProductLoading: false, 
  isProductsDetialerLoading: false, 
  isPopularCategoriesLoading: false, 
};

const SLICE_NAME = "statistic";

const statisticSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    updateSalesLoading: (state) => ({
      ...state,
      isSalesLoading: true,
    }),
    updateStatusOrderLoading: (state) => ({
      ...state,
      isStatusOrderLoading: true,
    }),
    updatePopularProductLoading: (state) => ({
      ...state,
      isPopularProductLoading: true,
    }),
    updateProductsDetialerLoading: (state) => ({
      ...state,
      isProductsDetialerLoading: true,
    }),
    updatePopularCategoriesLoading: (state) => ({
      ...state,
      isPopularCategoriesLoading: true,
    }),
    fetchStatisticSuccess: (state, action: PayloadAction<StatisticStatus>) => ({
      ...state,
      status: action.payload,
      isStatusOrderLoading: false,
    }),
    fetchPopularProductsSuccess: (state, action: PayloadAction<Product[]>) => ({
      ...state,
      popularProducts: action.payload,
      isPopularProductLoading: false,
    }),
    fetchSalesTotalOrderSuccess: (state, action: PayloadAction<number>) => ({
      ...state,
      totalOrder: action.payload,
      isFetchLoading: false,
    }),

    fetchPopularProductsDetailerSuccess: (
      state,
      action: PayloadAction<ProductDetail[]>
    ) => ({
      ...state,
      popularProductsDetialer: action.payload,
      isProductsDetialerLoading: false,
    }),
    fetchStatisticFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    fetchStatusOrderFailure: (state) => ({
      ...state,
      isStatusOrderLoading: false,
    }),
    fetchSalesSuccess: (state, action: PayloadAction<StatisticSales>) => ({
      ...state,
      sales: action.payload,
      isSalesLoading: false,
    }),
    fetchReviewsSuccess: (state, action: PayloadAction<StatisticReviews>) => ({
      ...state,
      reviews: action.payload,
      isFetchLoading: false,
    }),
    fetchPopularCategoriesSuccess: (
      state,
      action: PayloadAction<ProductCategory[]>
    ) => ({
      ...state,
      popularCategories: action.payload,
      isPopularCategoriesLoading: false,
    }),
    fetchSalesTotalSuccess: (state, action: PayloadAction<number>) => ({
      ...state,
      totalAmount: action.payload,
      isFetchLoading: false,
    }),
    fetchSalesTotalPostPaidSuccess: (state, action: PayloadAction<number>) => ({
      ...state,
      totalPostpaid: action.payload,
      isFetchLoading: false,
    }),
    fetchSalesTotalUserSuccess: (state, action: PayloadAction<number>) => ({
      ...state,
      totalUser: action.payload,
      isFetchLoading: false,
    }),
    fetchSalesTotalOrderFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
  },
});

export default statisticSlice.reducer;

export const {
  fetchSalesTotalPostPaidSuccess,
  fetchStatisticSuccess,
  fetchPopularProductsSuccess,
  fetchStatisticFailure,
  updateFetchLoading,
  fetchSalesSuccess,
  fetchPopularProductsDetailerSuccess,
  fetchReviewsSuccess,
  fetchPopularCategoriesSuccess,
  fetchSalesTotalSuccess,
  fetchSalesTotalUserSuccess,
  fetchSalesTotalOrderSuccess,
  fetchSalesTotalOrderFailure,
  fetchStatusOrderFailure,
  updateSalesLoading,
  updateStatusOrderLoading,
  updatePopularProductLoading,
  updateProductsDetialerLoading,
  updatePopularCategoriesLoading,
} = statisticSlice.actions;

export const fetchStatisticByRetailerAction = createAction<{
  queryParams?: QueryParams;
}>(`${SLICE_NAME}/fetchOrdersByRetailerRequest`);
export const fetchSalesTotalOrderAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchSalesTotalOrderRequest`);
export const fetchPopularProductsAction = createAction(
  `${SLICE_NAME}/fetchPopularProductsRequest`
);
export const fetchPopularProductsDetailerAction = createAction(
  `${SLICE_NAME}/fetchPopularProductsDetailerRequest`
);
export const fetchSalesAction = createAction<{
  queryParams?: QueryParams;
}>(`${SLICE_NAME}/fetchSalesRequest`);
export const fetchReviewsAction = createAction(
  `${SLICE_NAME}/fetchReviewsRequest`
);
export const fetchPopularCategoriesAction = createAction(
  `${SLICE_NAME}/fetchPopularCategoriesRequest`
);
export const fetchSalesTotalAction = createAction<{
  queryParams?: QueryParams;
}>(`${SLICE_NAME}/fetchSalesTotalRequest`);
export const fetchSalesPostpaidAction = createAction<{
  queryParams?: QueryParams;
}>(`${SLICE_NAME}/fetchSalesPostpaidRequest`);
export const fetchSalesTotalUserAction = createAction(
  `${SLICE_NAME}/fetchSalesTotalUserRequest`
);

function* handleFetchStatistic() {
  while (true) {
    const { payload }: ReturnType<typeof fetchStatisticByRetailerAction> =
      yield take(fetchStatisticByRetailerAction);
    try {
      yield put(updateStatusOrderLoading());
      const response: StatisticStatus = yield call(() =>
        getStatisticStatus(payload?.queryParams)
      );
      yield put(fetchStatisticSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatusOrderFailure());
    }
  }
}

function* handleFetchPopularProducts() {
  while (true) {
    yield take(fetchPopularProductsAction);
    try {
      yield put(updatePopularProductLoading());
      const response: Product[] = yield call(getStatisticPopularProduct);
      yield put(fetchPopularProductsSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatisticFailure());
    }
  }
}

function* handleFetchPopularProductsDettailer() {
  while (true) {
    yield take(fetchPopularProductsDetailerAction);
    try {
      yield put(updateProductsDetialerLoading());
      const response: ProductDetail[] = yield call(
        getStatisticPopularProductDetailer
      );
      yield put(fetchPopularProductsDetailerSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatisticFailure());
    }
  }
}

function* handleFetchSales() {
  while (true) {
    const { payload }: ReturnType<typeof fetchSalesAction> =
      yield take(fetchSalesAction);

    try {
      yield put(updateSalesLoading());
      const response: StatisticSales = yield call(() =>
        getStatisticSalesOverall(payload?.queryParams)
      );
      yield put(fetchSalesSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatisticFailure());
    }
  }
}

function* handleFetchReviews() {
  while (true) {
    yield take(fetchReviewsAction);
    try {
      yield put(updateFetchLoading());
      const response: StatisticReviews = yield call(getStatisticReviews);
      yield put(fetchReviewsSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatisticFailure());
    }
  }
}

function* handleFetchPopularCategories() {
  while (true) {
    yield take(fetchPopularCategoriesAction);
    try {
      yield put(updatePopularCategoriesLoading());
      const response: ProductCategory[] = yield call(
        getStatisticPopularCategories
      );
      yield put(fetchPopularCategoriesSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatisticFailure());
    }
  }
}

function* handleFetchSalesTotal() {
  while (true) {
    const { payload }: ReturnType<typeof fetchSalesTotalAction> = yield take(
      fetchSalesTotalAction
    );

    try {
      yield put(updateFetchLoading());
      const response: number = yield call(() =>
        getStatisticSalesTotal(payload?.queryParams)
      );
      yield put(fetchSalesTotalSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatisticFailure());
    }
  }
}

function* handleFetchSalesPostpaid() {
  while (true) {
    const { payload }: ReturnType<typeof fetchSalesPostpaidAction> = yield take(
      fetchSalesPostpaidAction
    );

    try {
      yield put(updateFetchLoading());
      const response: number = yield call(() =>
        getStatisticSalesPostpaid(payload?.queryParams)
      );
      yield put(fetchSalesTotalPostPaidSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatisticFailure());
    }
  }
}

function* handleFetchSalesTotalUser() {
  while (true) {
    yield take(fetchSalesTotalUserAction);
    try {
      yield put(updateFetchLoading());
      const response: number = yield call(getStatisticSalesTotalUser);
      yield put(fetchSalesTotalUserSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchStatisticFailure());
    }
  }
}

function* handleFetchSalesTotalOrder() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchSalesTotalOrderAction> = yield take(
      fetchSalesTotalOrderAction
    );

    try {
      yield put(updateFetchLoading());
      const response: number = yield call(() =>
        getStatisticSalesTotalOrder(queryParams)
      );
      yield put(fetchSalesTotalOrderSuccess(response));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchSalesTotalOrderFailure());
    }
  }
}

export const statisticSagas = [
  fork(handleFetchStatistic),
  fork(handleFetchPopularProducts),
  fork(handleFetchPopularProductsDettailer),
  fork(handleFetchSales),
  fork(handleFetchReviews),
  fork(handleFetchPopularCategories),
  fork(handleFetchSalesTotal),
  fork(handleFetchSalesTotalUser),
  fork(handleFetchSalesTotalOrder),
  fork(handleFetchSalesPostpaid),
];
