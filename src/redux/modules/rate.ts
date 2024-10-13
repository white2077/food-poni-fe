import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { call, put, takeLatest, fork } from "redux-saga/effects";

import { notification } from "antd";
import { Rate, Page } from "@/type/types";
import { getRatesByProductId } from "@/utils/api/rate";
import { QueryParams } from "@/utils/api/common";

export type RateState = {
  readonly page: Page<Rate[]>;
  readonly isFetchLoading: boolean;
};

const initialState: RateState = {
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
};

const rateSlice = createSlice({
  name: "rate",
  initialState,
  reducers: {
    fetchRatesByProductRequest: (
      state,
      action: PayloadAction<{ productId: string; queryParams: QueryParams }>,
    ) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchRatesByProductSuccess: (
      state,
      action: PayloadAction<Page<Rate[]>>,
    ) => ({
      ...state,
      page: action.payload,
      isFetchLoading: false,
    }),
    fetchRatesByProductFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
  },
});

export const {
  fetchRatesByProductRequest,
  fetchRatesByProductSuccess,
  fetchRatesByProductFailure,
} = rateSlice.actions;

export default rateSlice.reducer;

function* handleFetchRatesByProduct(
  action: ReturnType<typeof fetchRatesByProductRequest>,
) {
  try {
    const { productId, queryParams } = action.payload;
    const page: Page<Rate[]> = yield call(
      getRatesByProductId,
      productId,
      queryParams,
    );
    yield put(fetchRatesByProductSuccess(page));
  } catch (e) {
    notification.open({
      message: "Error",
      description: e.message,
      type: "error",
    });

    yield put(fetchRatesByProductFailure());
  }
}

function* watchFetchRatesByProduct() {
  yield takeLatest(fetchRatesByProductRequest, handleFetchRatesByProduct);
}

export const rateSagas = [fork(watchFetchRatesByProduct)];
