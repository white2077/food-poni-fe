import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, put, fork, take } from "redux-saga/effects";
import { notification } from "antd";
import { Rate, Page } from "@/type/types";
import { getRatesByProductId, createRate } from "@/utils/api/rate";
import { QueryParams } from "@/utils/api/common";

export type RateState = {
  rates: Page<Rate[]> | null;
  loading: boolean;
  error: string | null;
  showModalAddRate: boolean;
  selectOrderItemRate: string;
  showModalFileUpload: boolean;
};

const initialState: RateState = {
  rates: null,
  loading: false,
  error: null,
  showModalAddRate: false,
  selectOrderItemRate: "",
  showModalFileUpload: false,
};

const rateSlice = createSlice({
  name: "rate",
  initialState,
  reducers: {
    getRatesRequest: (
      state,
      action: PayloadAction<{ productId: string; queryParams: QueryParams }>,
    ) => ({
      ...state,
      loading: true,
      error: null,
    }),
    getRatesSuccess: (
      state,
      action: PayloadAction<Page<Rate[]>>,
    ) => ({
      ...state,
      rates: action.payload,
      loading: false,
    }),
    getRatesFailure: (
      state,
      action: PayloadAction<string>,
    ) => ({
      ...state,
      error: action.payload,
      loading: false,
    }),
    createRateRequest: (
      state,
      action: PayloadAction<{ orderItemId: string; rateRequest: Rate }>,
    ) => ({
      ...state,
      loading: true,
      error: null,
    }),
    createRateSuccess: (state) => ({
      ...state,
      loading: false,
    }),
    createRateFailure: (
      state,
      action: PayloadAction<string>,
    ) => ({
      ...state,
      error: action.payload,
      loading: false,
    }),
    setShowModalAddRate: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      console.log("Updating showModalAddRate:", action.payload);
      state.showModalAddRate = action.payload;
    },
    setSelectOrderItemRate: (
      state,
      action: PayloadAction<string>,
    ) => ({
      ...state,
      selectOrderItemRate: action.payload,
    }),
    closeModalAddRate: (state) => ({
      ...state,
      showModalAddRate: false,
    }),
    setShowModalFileUpload: (
      state,
      action: PayloadAction<boolean>,
    ) => ({
      ...state,
      showModalFileUpload: action.payload,
    }),
  },
});

export const {
  getRatesRequest,
  getRatesSuccess,
  getRatesFailure,
  createRateRequest,
  createRateSuccess,
  createRateFailure,
  setShowModalAddRate,
  setSelectOrderItemRate,
  closeModalAddRate,
  setShowModalFileUpload,
} = rateSlice.actions;

export default rateSlice.reducer;

function* handleGetRates() {
  while (true) {
    const action: ReturnType<typeof getRatesRequest> = yield take(getRatesRequest.type);
    try {
      const { productId, queryParams } = action.payload;
      const rates: Page<Rate[]> = yield call(getRatesByProductId, productId, queryParams);
      yield put(getRatesSuccess(rates));
    } catch (error) {
      yield put(getRatesFailure(error.message));
    }
  }
}

function* handleCreateRate() {
  while (true) {
    const action: ReturnType<typeof createRateRequest> = yield take(createRateRequest.type);
    try {
      const { orderItemId, rateRequest } = action.payload;
      yield call(createRate, orderItemId, rateRequest);
      yield put(createRateSuccess());
      yield put(closeModalAddRate());
      notification.success({
        message: "Đánh giá",
        description: "Đánh giá thành công!",
      });
    } catch (error) {
      yield put(createRateFailure(error.message));
      notification.error({
        message: "Đánh giá",
        description: error.message,
      });
    }
  }
}

export const rateSagas = [
  fork(handleGetRates),
  fork(handleCreateRate),
];
